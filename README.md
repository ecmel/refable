## Refable

Super simple JS framework inspired by [Stimulus](https://stimulus.hotwired.dev/).

### Installation

```bash
npm install refable --save-dev
```

### Application

```ts
import { Application } from "refable";
import Search from "./controllers/search.ts";

const application = new Application();

application.register("search", Search);

application.run();
```

### Controllers

```html
<div data-controller="search">
  <div data-controller="result"></div>
</div>
```

```ts
import { Controller } from "refable";
import Result from "./controllers/result.ts";

export default class extends Controller {
  declare readonly resultController: Result;
  declare readonly resultControllers: Result[];

  connected() {
    //
  }

  disconnected() {
    //
  }
}
```

### Targets

```html
<div data-controller="search">
  <div data-target="result"></div>
</div>
```

```ts
import { Controller } from "refable";

export default class extends Controller {
  declare readonly resultTarget: Element;
  declare readonly resultTargets: Element[];

  connected() {
    console.log(this.resultTarget);
  }
}
```

### Values

```html
<div data-controller="search" data-some-value="1"></div>
```

```ts
import { Controller } from "refable";

export default class extends Controller {
  declare readonly someValue: string;

  connected() {
    console.log(this.someValue);
  }

  someValueChanged(value) {
    //
  }
}
```

### Actions

```html
<div data-controller="search">
  <button data-action="click->find">Find</button>
</div>
```

```ts
import { Controller } from "refable";

export default class extends Controller {
  find() {
    console.log("Button clicked!");
  }
}
```
