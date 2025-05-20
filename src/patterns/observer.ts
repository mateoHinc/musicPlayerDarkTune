// Observer Pattern Implementation

/* 
export interface Observer {
  update(data: any): void;
}
*/

export interface Observer {
  update(data: unknown): void;
}

export class Subject {
  private observers: Observer[] = [];

  addObserver(observer: Observer) {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: unknown) {
    this.observers.forEach((observer) => observer.update(data));
  }
}
