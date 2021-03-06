<h5 align="center">
Run <a href="https://developers.google.com/web/tools/lighthouse">Lighthouse</a> and <a href="https://github.com/pa11y/pa11y">Pa11y</a> audits directly in your <a href="https://cypress.io/">Cypress</a> E2E test suites
</h5>

---

[![Build Status](https://travis-ci.org/mfrachet/cypress-audit.svg?branch=master)](https://travis-ci.org/mfrachet/cypress-audit) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Why cypress-audit](./docs/WHY.md) · [Before jumping in](./docs/BEFORE_JUMPING.md) · [Usage](#usage) · [Examples](./example)

## Usage

### Installation

To make `cypress-audit` working in your project, you have to follow these **3 steps**:

- In your favorite terminal:

```sh
$ yarn add -D cypress-audit
# or
$ npm install --save-dev cypress-audit
```

- In the `cypress/plugins/index.js` file:

```javascript
const { lighthouse, pa11y, prepareAudit } = require("cypress-audit");

module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });

  on("task", {
    lighthouse,
    pa11y,
  });
};
```

- In the `cypress/support/commands.js` file:

```javascript
import "cypress-audit/commands";
```

### In your code

After completing the [Installation](#installation) section, you are now able to use the `cy.audit` and `cy.pa11y` commands inside your tests.

```javascript
it("should pass the audits", function () {
  cy.lighthouse();
  cy.pa11y();
});
```

#### cy.pa11y

You can call `cy.pa11Y(opts)` with `opts` being any kind of [the pa11y options](https://github.com/pa11y/pa11y#configuration).

#### cy.lighthouse

If you don't provide any argument to the `cy.audit` command, the test will fail if at least one of your metrics is under `100`.

##### Thresholds per tests

You can make assumptions on the different metrics by passing an object as argument to the `cy.audit` command:

```javascript
it("should verify the lighthouse scores with thresholds", function () {
  cy.audit({
    performance: 85,
    accessibility: 100,
    "best-practices": 85,
    seo: 85,
    pwa: 100,
  });
});
```

If the Lighthouse analysis returns scores that are under the one set in arguments, the test will fail.

You can also make assumptions only on certain metrics. For example, the following test will **only** verify the "correctness" of the `performance` metric:

```javascript
it("should verify the lighthouse scores ONLY for performance", function () {
  cy.audit({
    performance: 85,
  });
});
```

This test will fail only when the `performance` metric provided by Lighthouse will be under `85`.

##### Globally set thresholds

While I would recommend to make per-test assumptions, it's possible to define general metrics inside the `cypress.json` file as following:

```json
{
  "lighthouse": {
    "performance": 85,
    "accessibility": 50,
    "best-practices": 85,
    "seo": 85,
    "pwa": 50
  }
}
```

_Note: These metrics are override by the per-tests one._
