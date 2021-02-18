import '../styles/styles.scss';

import { sayHello } from "./greeting/greeting.js";

sayHello();


if (module.hot) {
  module.hot.accept(function (err) {
    console.log(err);
  });
}
