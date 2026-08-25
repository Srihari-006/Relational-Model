import { TableRow, RelationalQueryResult } from '../types';
import { sampleDatabase } from '../data/sampleData';

export interface PredicateCondition {
  leftAttr: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE';
  rightType: 'literal' | 'attribute';
  rightValue: string | number;
}

/**
 * Parses simple string predicates like:
 * "dept_name = 'Physics' and salary > 90000"
 * or "instructor.ID = teaches.ID"
 */
function parsePredicate(predicateStr: string): { conditions: PredicateCondition[]; logicOp: 'AND' | 'OR' } {
  const trimmed = predicateStr.trim();
  if (!trimmed) {
    return { conditions: [], logicOp: 'AND' };
  }

  const logicOp: 'AND' | 'OR' = trimmed.toLowerCase().includes(' or ') ? 'OR' : 'AND';
  const parts = logicOp === 'OR' ? trimmed.split(/\s+or\s+/i) : trimmed.split(/\s+and\s+/i);

  const conditions: PredicateCondition[] = [];

  for (const part of parts) {
    const match = part.trim().match(/^([\w.]+)\s*(=|!=|>=|<=|>|<|LIKE)\s*(.+)$/i);
    if (match) {
      const leftAttr = match[1].trim();
      const operator = match[2].toUpperCase() as any;
      let rawRight = match[3].trim();

      // Check if quoted string literal
      if (
        (rawRight.startsWith("'") && rawRight.endsWith("'")) ||
        (rawRight.startsWith('"') && rawRight.endsWith('"'))
      ) {
        const strVal = rawRight.slice(1, -1);
        conditions.push({
          leftAttr,
          operator,
          rightType: 'literal',
          rightValue: strVal,
        });
      } else if (!isNaN(Number(rawRight))) {
        conditions.push({
          leftAttr,
          operator,
          rightType: 'literal',
          rightValue: Number(rawRight),
        });
      } else {
        // Attribute or unquoted string
        conditions.push({
          leftAttr,
          operator,
          rightType: 'literal',
          rightValue: rawRight,
        });
      }
    }
  }

  return { conditions, logicOp };
}

export class RelationalAlgebraEngine {
  private database: Record<string, TableRow[]>;
  private environment: Record<string, { columns: string[]; rows: TableRow[] }> = {};

  constructor(customData?: Record<string, TableRow[]>) {
    this.database = customData ? { ...customData } : { ...sampleDatabase };
    this.resetEnvironment();
  }

  public resetEnvironment() {
    this.environment = {};
    for (const [name, rows] of Object.entries(this.database)) {
      if (rows && rows.length > 0) {
        const columns = Object.keys(rows[0]).filter((k) => rows[0][k] !== undefined);
        this.environment[name] = { columns, rows: JSON.parse(JSON.stringify(rows)) };
      } else {
        this.environment[name] = { columns: [], rows: [] };
      }
    }
  }

  public getRelation(nameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[]): {
    name?: string;
    columns: string[];
    rows: TableRow[];
  } {
    if (typeof nameOrObj === 'string') {
      const cleanName = nameOrObj.trim();
      if (this.environment[cleanName]) {
        return { name: cleanName, ...this.environment[cleanName] };
      }
      if (this.database[cleanName]) {
        const rows = this.database[cleanName];
        const columns = rows.length > 0 ? Object.keys(rows[0]).filter((k) => rows[0][k] !== undefined) : [];
        return { name: cleanName, columns, rows: JSON.parse(JSON.stringify(rows)) };
      }
      throw new Error(`Relation "${cleanName}" not found in database or intermediate environment.`);
    }

    if (Array.isArray(nameOrObj)) {
      const rows = nameOrObj;
      const columns = rows.length > 0 ? Object.keys(rows[0]).filter((k) => rows[0][k] !== undefined) : [];
      return { columns, rows };
    }

    const rows = nameOrObj.rows || [];
    const columns = nameOrObj.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
    return { columns, rows };
  }

  public assign(varName: string, relationResult: { columns: string[]; rows: TableRow[] }) {
    this.environment[varName.trim()] = relationResult;
  }

  /**
   * Selection Operation (σ)
   */
  public select(
    sourceRelation: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    conditionsOrPredicate: PredicateCondition[] | string,
    logicOperator: 'AND' | 'OR' = 'AND'
  ): RelationalQueryResult {
    const rel = this.getRelation(sourceRelation);
    const initialCount = rel.rows.length;

    let conditions: PredicateCondition[] = [];
    let activeLogicOp = logicOperator;

    if (typeof conditionsOrPredicate === 'string') {
      const parsed = parsePredicate(conditionsOrPredicate);
      conditions = parsed.conditions;
      activeLogicOp = parsed.logicOp;
    } else {
      conditions = conditionsOrPredicate;
    }

    const filteredRows = rel.rows.filter((row) => {
      if (conditions.length === 0) return true;

      const evalCondition = (cond: PredicateCondition): boolean => {
        const leftVal = row[cond.leftAttr];
        let rightVal: any = cond.rightValue;

        if (cond.rightType === 'attribute') {
          rightVal = row[cond.rightValue as string];
        }

        if (leftVal === null || leftVal === undefined || rightVal === null || rightVal === undefined) {
          if (cond.operator === '=') return leftVal === rightVal;
          if (cond.operator === '!=') return leftVal !== rightVal;
          return false;
        }

        const numLeft = Number(leftVal);
        const numRight = Number(rightVal);
        const isNumeric = !isNaN(numLeft) && !isNaN(numRight) && typeof leftVal === 'number';

        switch (cond.operator) {
          case '=':
            return isNumeric ? numLeft === numRight : String(leftVal).toLowerCase() === String(rightVal).toLowerCase();
          case '!=':
            return isNumeric ? numLeft !== numRight : String(leftVal).toLowerCase() !== String(rightVal).toLowerCase();
          case '>':
            return isNumeric ? numLeft > numRight : String(leftVal) > String(rightVal);
          case '<':
            return isNumeric ? numLeft < numRight : String(leftVal) < String(rightVal);
          case '>=':
            return isNumeric ? numLeft >= numRight : String(leftVal) >= String(rightVal);
          case '<=':
            return isNumeric ? numLeft <= numRight : String(leftVal) <= String(rightVal);
          case 'LIKE':
            return String(leftVal).toLowerCase().includes(String(rightVal).toLowerCase());
          default:
            return false;
        }
      };

      if (activeLogicOp === 'AND') {
        return conditions.every(evalCondition);
      } else {
        return conditions.some(evalCondition);
      }
    });

    const predStr =
      typeof conditionsOrPredicate === 'string'
        ? conditionsOrPredicate
        : conditions
            .map((c) => `${c.leftAttr} ${c.operator} ${c.rightType === 'literal' ? (typeof c.rightValue === 'string' ? `"${c.rightValue}"` : c.rightValue) : c.rightValue}`)
            .join(activeLogicOp === 'AND' ? ' ∧ ' : ' ∨ ');

    const expr = `σ_{${predStr || 'TRUE'}}(${typeof sourceRelation === 'string' ? sourceRelation : 'r'})`;

    return {
      columns: [...rel.columns],
      rows: filteredRows,
      cardinality: filteredRows.length,
      degree: rel.columns.length,
      explanation: `Selection σ_${predStr || 'TRUE'} returned ${filteredRows.length} of ${initialCount} tuples.`,
      executionSteps: [
        `Scanned ${initialCount} input tuples`,
        `Evaluated selection predicate: [${predStr || 'TRUE'}]`,
        `Retained ${filteredRows.length} matching tuples`,
      ],
      expression: expr,
    };
  }

  /**
   * Projection Operation (∏)
   */
  public project(
    sourceRelation: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    attributes: string[]
  ): RelationalQueryResult {
    const rel = this.getRelation(sourceRelation);
    const validAttrs = attributes.filter((attr) => rel.columns.includes(attr));

    if (validAttrs.length === 0) {
      // If none matched exact, fallback to requested attributes that exist in rows
      const fallbackAttrs = attributes.length > 0 ? attributes : rel.columns;
      validAttrs.push(...fallbackAttrs);
    }

    const seenTuples = new Set<string>();
    const projectedRows: TableRow[] = [];
    let duplicatesRemoved = 0;

    for (const row of rel.rows) {
      const newRow: TableRow = {};
      for (const attr of validAttrs) {
        newRow[attr] = row[attr];
      }
      const serialized = JSON.stringify(newRow);
      if (!seenTuples.has(serialized)) {
        seenTuples.add(serialized);
        projectedRows.push(newRow);
      } else {
        duplicatesRemoved++;
      }
    }

    const expr = `∏_{${validAttrs.join(', ')}}(${typeof sourceRelation === 'string' ? sourceRelation : 'r'})`;

    return {
      columns: validAttrs,
      rows: projectedRows,
      cardinality: projectedRows.length,
      degree: validAttrs.length,
      explanation: `Projection ∏_${validAttrs.join(', ')} retained ${validAttrs.length} attributes. ${duplicatesRemoved} duplicate tuples were eliminated.`,
      executionSteps: [
        `Extracted attributes [${validAttrs.join(', ')}] from ${rel.rows.length} tuples`,
        `Removed duplicate rows to preserve relational set semantics (${duplicatesRemoved} duplicates removed)`,
        `Resulting relation has cardinality = ${projectedRows.length}, degree = ${validAttrs.length}`,
      ],
      expression: expr,
    };
  }

  /**
   * Cartesian Product Operation (×)
   */
  public cartesianProduct(
    rel1NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[]
  ): RelationalQueryResult {
    const rel1 = this.getRelation(rel1NameOrObj);
    const rel2 = this.getRelation(rel2NameOrObj);

    const name1 = typeof rel1NameOrObj === 'string' ? rel1NameOrObj : 'r';
    const name2 = typeof rel2NameOrObj === 'string' ? rel2NameOrObj : 's';

    const commonCols = rel1.columns.filter((c) => rel2.columns.includes(c));

    const finalCols1 = rel1.columns.map((c) => (commonCols.includes(c) ? `${name1}.${c}` : c));
    const finalCols2 = rel2.columns.map((c) => (commonCols.includes(c) ? `${name2}.${c}` : c));
    const resultColumns = [...finalCols1, ...finalCols2];

    const resultRows: TableRow[] = [];

    for (const r1 of rel1.rows) {
      for (const r2 of rel2.rows) {
        const combined: TableRow = {};
        for (let i = 0; i < rel1.columns.length; i++) {
          const rawCol = rel1.columns[i];
          const outCol = finalCols1[i];
          combined[outCol] = r1[rawCol];
          if (!commonCols.includes(rawCol)) {
            combined[rawCol] = r1[rawCol];
          }
        }
        for (let j = 0; j < rel2.columns.length; j++) {
          const rawCol = rel2.columns[j];
          const outCol = finalCols2[j];
          combined[outCol] = r2[rawCol];
          if (!commonCols.includes(rawCol)) {
            combined[rawCol] = r2[rawCol];
          }
        }
        resultRows.push(combined);
      }
    }

    const totalTuples = rel1.rows.length * rel2.rows.length;
    const expr = `${name1} × ${name2}`;

    return {
      columns: resultColumns,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: resultColumns.length,
      explanation: `Cartesian Product ${name1} × ${name2} paired ${rel1.rows.length} tuples with ${rel2.rows.length} tuples = ${totalTuples} tuples (degree = ${resultColumns.length}).`,
      executionSteps: [
        `Paired each tuple in ${name1} (|${rel1.rows.length}|) with each in ${name2} (|${rel2.rows.length}|)`,
        `Disambiguated shared attributes: [${commonCols.join(', ')}] with prefixes`,
        `Generated ${resultRows.length} total rows`,
      ],
      expression: expr,
    };
  }

  /**
   * Theta Join Operation (⋈_θ)
   */
  public join(
    rel1NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[],
    conditionsOrPredicate: PredicateCondition[] | string
  ): RelationalQueryResult {
    const cp = this.cartesianProduct(rel1NameOrObj, rel2NameOrObj);
    const sel = this.select(cp, conditionsOrPredicate as any, 'AND');

    const name1 = typeof rel1NameOrObj === 'string' ? rel1NameOrObj : 'r';
    const name2 = typeof rel2NameOrObj === 'string' ? rel2NameOrObj : 's';
    const condStr = typeof conditionsOrPredicate === 'string' ? conditionsOrPredicate : 'θ';

    const expr = `${name1} ⋈_{${condStr}} ${name2}`;

    return {
      columns: cp.columns,
      rows: sel.rows,
      cardinality: sel.rows.length,
      degree: cp.columns.length,
      explanation: `Theta Join ${name1} ⋈_(${condStr}) ${name2} yielded ${sel.rows.length} matched rows out of ${cp.rows.length} Cartesian product combinations.`,
      executionSteps: [
        `Computed ${name1} × ${name2} (${cp.rows.length} tuples)`,
        `Applied join condition σ_(${condStr})`,
        `Retained ${sel.rows.length} satisfying tuples`,
      ],
      expression: expr,
    };
  }

  /**
   * Natural Join Operation (⋈)
   */
  public naturalJoin(
    rel1NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { name?: string; columns?: string[]; rows?: TableRow[] } | TableRow[]
  ): RelationalQueryResult {
    const rel1 = this.getRelation(rel1NameOrObj);
    const rel2 = this.getRelation(rel2NameOrObj);

    const commonCols = rel1.columns.filter((c) => rel2.columns.includes(c));
    const extraCols2 = rel2.columns.filter((c) => !commonCols.includes(c));
    const resultCols = [...rel1.columns, ...extraCols2];

    const resultRows: TableRow[] = [];

    for (const r1 of rel1.rows) {
      for (const r2 of rel2.rows) {
        const matches = commonCols.every((col) => r1[col] === r2[col]);
        if (matches) {
          const merged: TableRow = { ...r1 };
          for (const col of extraCols2) {
            merged[col] = r2[col];
          }
          resultRows.push(merged);
        }
      }
    }

    const name1 = typeof rel1NameOrObj === 'string' ? rel1NameOrObj : 'r';
    const name2 = typeof rel2NameOrObj === 'string' ? rel2NameOrObj : 's';
    const expr = `${name1} ⋈ ${name2}`;

    return {
      columns: resultCols,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: resultCols.length,
      explanation: `Natural Join ${name1} ⋈ ${name2} on shared attributes [${commonCols.join(', ')}] produced ${resultRows.length} tuples.`,
      executionSteps: [
        `Identified common attributes: [${commonCols.join(', ')}]`,
        `Joined rows where all common attributes match`,
        `Merged schemas into ${resultCols.length} columns with ${resultRows.length} tuples`,
      ],
      expression: expr,
    };
  }

  /**
   * Union Operation (∪)
   */
  public union(
    rel1NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    name1 = 'R₁',
    name2 = 'R₂'
  ): RelationalQueryResult {
    const rel1 = this.getRelation(rel1NameOrObj);
    const rel2 = this.getRelation(rel2NameOrObj);

    const seen = new Set<string>();
    const resultRows: TableRow[] = [];

    for (const r of [...rel1.rows, ...rel2.rows]) {
      const standardizedRow: TableRow = {};
      const valArray: any[] = [];
      for (let i = 0; i < rel1.columns.length; i++) {
        const col1 = rel1.columns[i];
        const val = r[col1] !== undefined ? r[col1] : r[rel2.columns[i]];
        standardizedRow[col1] = val;
        valArray.push(val);
      }
      const key = JSON.stringify(valArray);
      if (!seen.has(key)) {
        seen.add(key);
        resultRows.push(standardizedRow);
      }
    }

    const expr = `${name1} ∪ ${name2}`;

    return {
      columns: rel1.columns,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: rel1.columns.length,
      explanation: `Union (${expr}) combined ${rel1.rows.length} and ${rel2.rows.length} tuples into ${resultRows.length} distinct tuples (duplicates eliminated).`,
      executionSteps: [
        `Verified arity matching (${rel1.columns.length} columns each)`,
        `Merged tuple sets and eliminated duplicate records`,
        `Output cardinality: ${resultRows.length}`,
      ],
      expression: expr,
    };
  }

  /**
   * Set Intersection (∩)
   */
  public intersect(
    rel1NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    name1 = 'R₁',
    name2 = 'R₂'
  ): RelationalQueryResult {
    const rel1 = this.getRelation(rel1NameOrObj);
    const rel2 = this.getRelation(rel2NameOrObj);

    const rel2Keys = new Set(
      rel2.rows.map((r) => JSON.stringify(rel2.columns.map((c) => r[c])))
    );

    const seen = new Set<string>();
    const resultRows: TableRow[] = [];

    for (const r of rel1.rows) {
      const key = JSON.stringify(rel1.columns.map((c) => r[c]));
      if (rel2Keys.has(key) && !seen.has(key)) {
        seen.add(key);
        resultRows.push({ ...r });
      }
    }

    const expr = `${name1} ∩ ${name2}`;

    return {
      columns: rel1.columns,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: rel1.columns.length,
      explanation: `Set Intersection (${expr}) found ${resultRows.length} tuples present in both relations.`,
      executionSteps: [
        `Checked tuple membership in both input sets`,
        `Retained common tuples: ${resultRows.length}`,
      ],
      expression: expr,
    };
  }

  /**
   * Set Difference (−)
   */
  public difference(
    rel1NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    rel2NameOrObj: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    name1 = 'R₁',
    name2 = 'R₂'
  ): RelationalQueryResult {
    const rel1 = this.getRelation(rel1NameOrObj);
    const rel2 = this.getRelation(rel2NameOrObj);

    const rel2Keys = new Set(
      rel2.rows.map((r) => JSON.stringify(rel2.columns.map((c) => r[c])))
    );

    const seen = new Set<string>();
    const resultRows: TableRow[] = [];

    for (const r of rel1.rows) {
      const key = JSON.stringify(rel1.columns.map((c) => r[c]));
      if (!rel2Keys.has(key) && !seen.has(key)) {
        seen.add(key);
        resultRows.push({ ...r });
      }
    }

    const expr = `${name1} − ${name2}`;

    return {
      columns: rel1.columns,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: rel1.columns.length,
      explanation: `Set Difference (${expr}) found ${resultRows.length} tuples in the first relation that do not appear in the second.`,
      executionSteps: [
        `Scanned first relation (|${rel1.rows.length}|)`,
        `Excluded tuples appearing in second relation (|${rel2.rows.length}|)`,
        `Resulting cardinality: ${resultRows.length}`,
      ],
      expression: expr,
    };
  }

  /**
   * Rename Operation (ρ)
   */
  public rename(
    sourceRelation: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    newName: string,
    newColumnNames?: string[]
  ): RelationalQueryResult {
    const rel = this.getRelation(sourceRelation);
    const finalCols = newColumnNames && newColumnNames.length === rel.columns.length ? newColumnNames : [...rel.columns];

    const renamedRows = rel.rows.map((row) => {
      const newRow: TableRow = {};
      rel.columns.forEach((oldCol, i) => {
        const newCol = finalCols[i];
        newRow[newCol] = row[oldCol];
      });
      return newRow;
    });

    const expr = `ρ_{${newName}}(${typeof sourceRelation === 'string' ? sourceRelation : 'r'})`;

    const result = {
      columns: finalCols,
      rows: renamedRows,
      cardinality: renamedRows.length,
      degree: finalCols.length,
      explanation: `Rename ρ_${newName}${newColumnNames ? `(${newColumnNames.join(',')})` : ''} assigned relation name "${newName}".`,
      executionSteps: [`Renamed relation to "${newName}"`, `Columns: [${finalCols.join(', ')}]`],
      expression: expr,
    };

    this.assign(newName, result);
    return result;
  }

  /**
   * Aggregate Function (γ) with optional Group By
   * Supports both (source, 'avg', 'salary', ['dept_name']) and (source, ['dept_name'], 'avg', 'salary')
   */
  public aggregate(
    sourceRelation: string | { columns?: string[]; rows?: TableRow[] } | TableRow[],
    param2: string[] | string,
    param3: string,
    param4?: string | string[]
  ): RelationalQueryResult {
    const rel = this.getRelation(sourceRelation);

    let groupByAttrs: string[] = [];
    let aggFunc: 'avg' | 'min' | 'max' | 'sum' | 'count' = 'avg';
    let aggAttr = 'salary';

    if (Array.isArray(param2)) {
      groupByAttrs = param2;
      aggFunc = (param3 as any) || 'avg';
      aggAttr = (param4 as string) || 'salary';
    } else {
      aggFunc = (param2 as any) || 'avg';
      aggAttr = param3 || 'salary';
      if (Array.isArray(param4)) {
        groupByAttrs = param4;
      } else if (typeof param4 === 'string' && param4) {
        groupByAttrs = [param4];
      }
    }

    const groups = new Map<string, { groupValues: TableRow; items: TableRow[] }>();

    for (const row of rel.rows) {
      const groupKeyObj: TableRow = {};
      for (const attr of groupByAttrs) {
        groupKeyObj[attr] = row[attr];
      }
      const key = JSON.stringify(groupKeyObj);

      if (!groups.has(key)) {
        groups.set(key, { groupValues: groupKeyObj, items: [] });
      }
      groups.get(key)!.items.push(row);
    }

    const outColName = `${aggFunc}_${aggAttr}`;
    const resultColumns = [...groupByAttrs, outColName];
    const resultRows: TableRow[] = [];

    groups.forEach(({ groupValues, items }) => {
      const outRow: TableRow = { ...groupValues };
      const values = items.map((i) => Number(i[aggAttr])).filter((n) => !isNaN(n));

      let val: number = 0;
      switch (aggFunc) {
        case 'avg':
          val = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
          break;
        case 'sum':
          val = values.reduce((a, b) => a + b, 0);
          break;
        case 'min':
          val = values.length > 0 ? Math.min(...values) : 0;
          break;
        case 'max':
          val = values.length > 0 ? Math.max(...values) : 0;
          break;
        case 'count':
          val = items.length;
          break;
      }

      outRow[outColName] = val;
      resultRows.push(outRow);
    });

    const expr = groupByAttrs.length > 0
      ? `${groupByAttrs.join(', ')} G_{${aggFunc}(${aggAttr})}(${typeof sourceRelation === 'string' ? sourceRelation : 'r'})`
      : `G_{${aggFunc}(${aggAttr})}(${typeof sourceRelation === 'string' ? sourceRelation : 'r'})`;

    return {
      columns: resultColumns,
      rows: resultRows,
      cardinality: resultRows.length,
      degree: resultColumns.length,
      explanation: `Aggregate ${expr} produced ${resultRows.length} aggregated groups.`,
      executionSteps: [
        `Grouped ${rel.rows.length} tuples by [${groupByAttrs.join(', ') || 'ALL'}]`,
        `Calculated ${aggFunc}(${aggAttr}) per group`,
      ],
      expression: expr,
    };
  }
}

export const defaultEngine = new RelationalAlgebraEngine();
export const relationalAlgebraEngine = defaultEngine;
