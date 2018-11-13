
export class PriorityQueue<T> {

  private queue: T[] = []
  private plain: T[] = []
  private priorities: number[] = []

  public put(v: T, priority: number) {
    this.queue.push(v)
    this.plain.push(v)
    this.priorities.push(priority)

    this.queue.sort((a, b) => {
      if (this.priorities[this.plain.indexOf(a)] > this.priorities[this.plain.indexOf(b)]) {
        return 1
      } else {
        return -1
      }
    })
  }

  public get(): T {
    const result = this.queue.shift()
    const location = this.plain.indexOf(result)
    this.plain.splice(location, 1)
    this.priorities.splice(location, 1)
    return result
  }

  public get length() { return this.plain.length }
}