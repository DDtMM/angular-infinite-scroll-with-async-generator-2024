import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

const GIVEN_NAMES = [
  "Abigail", "Aaliyah", "Alexander", "Aria", "Anna", "Anthony", "Aurora", "Ava", "Avery", "Benjamin",
  "Brooklyn", "Caden", "Camila", "Carter", "Chloe", "Christopher", "Claire", "Colton", "Daniel", "David",
  "Dylan", "Eleanor", "Elijah", "Ellie", "Emma", "Ethan", "Evelyn", "Ezra", "Gabriel", "Grace",
  "Grayson", "Hailey", "Hazel", "Henry", "Hunter", "Isla", "Isaac", "Isabella", "Isaiah", "Jackson",
  "Jacob", "James", "Jayden", "John", "Joseph", "Joshua", "Julian", "Layla", "Leah", "Levi",
  "Liam", "Lillian", "Lily", "Luna", "Madison", "Mason", "Matthew", "Maya", "Mia", "Mila",
  "Muhammad", "Natalie", "Nathan", "Nora", "Oliver", "Olivia", "Owen", "Paisley", "Penelope", "Riley",
  "Ryan", "Samuel", "Scarlett", "Sebastian", "Sofia", "Sophia", "Sophie", "Stella", "Skylar", "Sofia",
  "Sophie", "Sophia", "Stella", "Victoria", "Wyatt", "Zara", "Zoe"
];

const SURNAMES = [
  "Abbas", "Abebe", "Adams", "Ah", "Ali", "Allen", "Almeida", "Anderson", "Arroyo", "Barros",
  "Brown", "Carter", "Chen", "Chung", "Cooper", "Davis", "De Luca", "Duarte", "Ekwueme", "Evans",
  "Ferreira", "Fisher", "Garcia", "Gomes", "Gupta", "Hernandez", "Hill", "Huang", "Ishikawa", "Jackson",
  "Jenkins", "Johnson", "Jones", "Kaur", "Kawaguchi", "Khan", "Kim", "Kimura", "Li", "Lin",
  "Lopez", "Machado", "Martinez", "Miller", "Mohamed", "Nakamura", "Nguyen", "Nogueira", "Nunes", "Okoye",
  "Oliveira", "Patel", "Pereira", "Ramirez", "Reyes", "Ribeiro", "Roberts", "Robinson", "Rodriguez", "Rossi",
  "Russell", "Saito", "Sanchez", "Sharma", "Silva", "Singh", "Smith", "Souza", "Suzuki", "Takahashi",
  "Tanaka", "Taylor", "Tavares", "Teixeira", "Thompson", "Torres", "Tran", "Turner", "Vargas", "Wang",
  "White", "Williams", "Wilson", "Wong", "Wu", "Xu", "Yamamoto", "Yang", "Yilmaz", "Yoon",
  "Young", "Zafar", "Zhang", "Zhao", "Zhou"
];


function sampleDataFactory(index: number): SampleData {
  return {
    imgUrl: `https://picsum.photos/seed/${index + 1}/200`,
    name: `${GIVEN_NAMES[Math.floor(Math.random() * GIVEN_NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`,
    price: Math.floor(Math.random() * 1000)
  }
}
export interface SampleData {
  imgUrl: string;
  name: string;
  price: number;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly maxItems = 9999;
  private readonly responseDelay = 2000;

  getInventoryFromArray(pageIndex: number, pageSize: number): SampleData[] {
    return this.getPageItems(pageSize, pageSize * pageIndex, sampleDataFactory);
  }

  getInventoryFromObservable(pageIndex: number, pageSize: number): Observable<SampleData[]> {
    return of(this.getPageItems(pageSize, pageSize * pageIndex, sampleDataFactory)).pipe(delay(this.responseDelay));
  }

  getInventoryFromPromise(pageIndex: number, pageSize: number): Promise<SampleData[]> {
    return new Promise(r => setTimeout(() => r(this.getPageItems(pageSize, pageSize * pageIndex, sampleDataFactory)), this.responseDelay));
  }

  private getPageItems<T>(desiredLength: number, startIndex: number, factoryFn: (index: number) => T): T[] {
    const length = Math.max(0, Math.min(desiredLength, this.maxItems - startIndex));
    return Array(length).fill(0).map((_, i) => factoryFn(i));
  }
}

