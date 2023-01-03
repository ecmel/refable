# Refable

Super simple JS framework inspired by [Stimulus](https://github.com/hotwired/stimulus).

## Installation

```bash
npm install refable --save-dev
```

## Application

Application is the main class for bootstrapping. Controllers are registered on an application instance. For registering glob of controllers please refer to your bundler's documentation.

```ts
import { Application } from "refable";
import Search from "./controllers/search";

const application = new Application();

application.register("search", Search);

application.run();
```

## Controllers

Controllers are instances of classes that you register in your application. Each controller class inherits from the Controller base class. Controllers can be nested within controllers and can be referenced in the parent controller.

```html
<div data-controller="search">
    <div data-controller="result"></div>
</div>
```

```ts
import { Controller } from "refable";
import Result from "./controllers/result";

export default class extends Controller {
    declare readonly resultController: Result;
    declare readonly resultControllers: Result[];

    connected() {
        //
    }

    disconnected() {
        //
    }

    resultControllerConnected(result: Result) {
        //
    }

    resultControllerDisconnected(result: Result) {
        //
    }
}
```

Controller classes are templated so more specific elements can be used if needed.

```ts
import { Controller } from "refable";

export default class extends Controller<HTMLElement> {
    //
}
```

## Values

Controllers are created for elements when inserted into DOM and deleted when removed so all long lived state should be kept in values.

```html
<div data-controller="search" data-some-value="1"></div>
```

```ts
import { Controller } from "refable";

export default class extends Controller {
    declare readonly someValue: string;

    someValueChanged(value: string) {
        //
    }
}
```

## Targets

Targets map important elements to controller properties.

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

    resultTargetConnected(el: Element) {
        //
    }

    resultTargetDisconnected(el: Element) {
        //
    }
}
```

## Actions

Actions are for handling DOM events in controllers.

```html
<div data-controller="search">
    <button data-action="click->find">Find</button>
</div>
```

```ts
import { Controller } from "refable";

export default class extends Controller {
    find() {
        //
    }
}
```

### Event Options

You can append one or more action options to an action descriptor if you need to specify event listener options.

```html
<button data-action="click->find[:option]">Find</button>
```

Following action options are supported:

```
:capture
:once
:passive
:stop
:prevent
```
