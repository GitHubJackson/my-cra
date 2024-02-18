import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// enum EDirection {
//   None,
//   Left,
//   Right,
// }
// const root = document.getElementById("root");
// root.textContent = "hello my-cra";
// export let a: number = 1;
// export const map = new Map();
// map.set("name", "Lucas");
// const fn = () => {
//   console.log("===fn", a, map, EDirection.Left);
// };
// console.log(fn);

// class Person {
//   private name: string;
//   private age: number;
//   constructor(name: string, age: number) {
//     this.name = name;
//     this.age = age;
//   }
//   sayHi() {
//     console.log(`Hi, I'm ${this.name}, and I'm ${this.age} years old`);
//   }
// }

// const start = () => {
//   const boy = new Person("lucas", 25);
//   boy.sayHi();
// };

// start();

// export default start;
