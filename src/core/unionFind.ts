/**
 * Disjoint Set Union (Union-Find) 자료구조
 * 경로 압축(Path Compression) 및 랭크 기반 합치기(Union by Rank) 최적화 적용
 */
export class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;
  private groupCount: number;

  constructor(elements: readonly string[] = []) {
    this.parent = new Map();
    this.rank = new Map();
    this.groupCount = elements.length;

    for (const el of elements) {
      this.parent.set(el, el);
      this.rank.set(el, 0);
    }
  }

  /**
   * 요소가 속한 집합의 대표 원소(루트)를 찾음 (경로 압축 적용)
   */
  public find(x: string): string {
    const p = this.parent.get(x);
    if (p === undefined) {
      // 등록되지 않은 원소인 경우 자기 자신을 루트로 등록
      this.parent.set(x, x);
      this.rank.set(x, 0);
      this.groupCount++;
      return x;
    }
    if (p === x) {
      return x;
    }
    const root = this.find(p);
    this.parent.set(x, root);
    return root;
  }

  /**
   * 두 원소가 속한 집합을 합침
   * @returns 이미 같은 집합이면 false (사이클 발생), 서로 다른 집합이어서 성공적으로 합쳐지면 true
   */
  public union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      // 이미 같은 집합에 속해 있음 -> 이 두 정점을 연결하면 사이클(순환선)이 형성됨
      return false;
    }

    const rankX = this.rank.get(rootX) ?? 0;
    const rankY = this.rank.get(rootY) ?? 0;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }

    this.groupCount--;
    return true;
  }

  /**
   * 두 원소가 같은 집합에 속해 있는지(연결되어 있는지) 확인
   */
  public connected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }

  /**
   * 현재 독립된 집합(연결 성분)의 개수
   */
  public getGroupCount(): number {
    return this.groupCount;
  }
}
