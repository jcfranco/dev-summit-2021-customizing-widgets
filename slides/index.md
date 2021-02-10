<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-1.png" data-background-size="cover" -->
<!-- Presenter: Franco -->

# ArcGIS API for JavaScript: Customizing Widgets

### JC Franco – [@arfncode](https://twitter.com/arfncode)

### Matt Driscoll – [@driskull](https://twitter.com/driskull)

---

# Agenda

- What can be customized
- Customization approaches with demos

---

# Customization Approaches

- Authoring a theme (Sass)<!-- .element: class="fragment" data-fragment-index="1" -->
  - Changing styles: colors, sizing, font, etc.
- Extending a view (TypeScript)<!-- .element: class="fragment" data-fragment-index="2" -->
  - Altering presentation
  - Adding functionality

---

<!-- Presenter: Franco -->

<h1>Part I</h1>

<h2>Theming</h2>

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-3.png" data-background-size="cover"  -->

---

# Part I: Theming

## Why Theme? <!-- .element: class="fragment" data-fragment-index="0" -->

- Match branding.
- Contrast with the map.
- User-specific (e.g. bigger buttons).

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Esri Themes

10 themes are provided **out-of-the-box**:

Using a theme requires only a slight update to the CSS path.

```html
<link rel="stylesheet" href="https://js.arcgis.com/<version>/esri/themes/<theme-name>/main.css" />
```

---

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-4.png" data-background-size="cover"  -->

**Theme Switcher**

[Out-of-the-box themes](../demos/out-of-the-box-themes/)

---

# Theming Technology

---

We use

![Sass](./img/sass-white.png)

### to create our CSS.

<img src="img/nodejs-new-pantone-black.png" height="80" style="margin-left:10px; margin-right: 10px;"/><!-- .element: class="fragment" data-fragment-index="1" -->
<img src="img/grunt.svg" height="80" style="margin-left:10px; margin-right: 10px;"/><!-- .element: class="fragment" data-fragment-index="1" -->

<small><a href="https://nodejs.org/">nodejs.org</a> | <a href="https://gruntjs.com/">gruntjs.com</a></small><!-- .element: class="fragment" data-fragment-index="1" -->

---

![Sass](./img/sass-white.png)

### is a powerful scripting language for compiling CSS.

- It's modular.
- It's DRY.
- It makes theming easy.

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Theming Steps

1.  Install the [`@arcgis/cli`](https://www.npmjs.com/package/@arcgis/cli) NPM package
1.  Use `styles` commands to  
    1.  Create
    1.  Preview
    1.  Customize
1.  Host and reference your custom theme.

<!-- .element: class="fragment" data-fragment-index="1" -->

---


# Step 1

Install [`@arcgis/cli`](https://www.npmjs.com/package/@arcgis/cli)


```
npm install -g @arcgis/cli
```
<!-- .element: style="text-align: center" -->

---

# Step 2

Create a theme

```
arcgis-cli styles create <theme> 
```

Run a preview

```
arcgis-cli styles preview <theme>
```

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Step 3

Edit your theme<br/>
`<theme>/main.scss`

---

# Step 4

Eject and host/reference your custom theme. 

```html
<!-- In your app: -->
<link href="path/to/your/<theme>/main.css" rel="stylesheet" />
```

---

# Goals

Theme Smart

- Avoid adding additional CSS selectors
- Instead, use Sass to your advantage

---

# Theme Structure

Let's look at how the core theme is structured

- Color <span>: `_color.scss`</span><!-- .element: class="fragment" data-fragment-index="1" -->
- Size <span>: `_sizes.scss`</span><!-- .element: class="fragment" data-fragment-index="1" -->
- Type <span>: `_type.scss`</span><!-- .element: class="fragment" data-fragment-index="1" -->

---

# Theme Structure

### Default

```scss
// Inside base/_color_.scss
$background-color: #fff !default;
```

Any value assignment overrides the `!default` value.

```scss
// Inside my-theme/main.scss
$background-color: #116EBF;
```

But wait...there's more!<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Theme Structure

Override the core color variables...

```scss
$font-color: #0442BF;
$interactive-font-color: #F20530;
$background-color: #116EBF;
$button-color: #F2B705;
```

...then magic!<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Magic

Using `$button-color` we "automagically" set the hover color.

```scss
$button-color--hover: darken($button-color, 10%) !default;
// ...etc
```

[API Styling Guide](https://developers.arcgis.com/javascript/latest/guide/styling/index.html#sassy-widgets)

---

# Part I: Let's make a theme

<!-- <img src="./img/custom-theme.png" /> -->

---

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-4.png" data-background-size="cover" -->

**Custom Theme**

<!-- preview page requires utility to be running -->

[Preview](http://localhost:3001/preview/) | [Demo Steps](../demos/custom-theme/STEPS.md)

---

# Part I: Theming Recap

- Used [`@arcgis/cli`](https://www.npmjs.com/package/@arcgis/cli) for easy theming
- Saw theme structure
  - Color
  - Size
  - Typography
- Used the core and override values.

---

<!-- NEXT PART  B -->
<h1>Part II</h1>

<h2>Views</h2>

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-3.png" data-background-size="cover"  -->

---

<!-- Presenter: Matt -->

# Part II: Widget Composition

Widgets are composed of Views & ViewModels

- Logic is separate from presentation
- Reusable
- UI replacement
- Framework integration

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Part II: TypeScript

- Widgets written in TypeScript (Typed JavaScript)
- JS of the future, now <!-- .element: class="fragment" data-fragment-index="1" -->
- IDE support <!-- .element: class="fragment" data-fragment-index="2" -->
  - Visual Studio
  - WebStorm
  - Sublime
  - and more!

---

# Part II: Views

- Presentation of the Widget
  - DOM structure
- Use ViewModel APIs to render the UI
- View-specific logic resides here
- Extend `esri/widgets/Widget`

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Part II: Widget Class

[`esri/widgets/Widget`](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Widget.html)

- Provides lifecycle
- API consistency

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Part II: Widget Lifecycle

- &shy;<!-- .element: class="fragment" data-fragment-index="1" --> `constructor()`
- &shy;<!-- .element: class="fragment" data-fragment-index="2" --> `postInitialize()`
- &shy;<!-- .element: class="fragment" data-fragment-index="3" --> `render()`
  - &shy;<!-- .element: class="fragment" data-fragment-index="4" --> `when()` - after first render
- &shy;<!-- .element: class="fragment" data-fragment-index="5" --> `destroy()`

---

# Part II: `render()`

- Defines UI
- Reacts to state changes
- Uses JSX (VDOM)
- Re-renders on prop updates

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Part II: Working with Views

API Exploration

[BasemapToggle Doc](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-BasemapToggle.html)

---

# Part II: Views Recap

What have we learned about Widget Views?

- Face of the widget
- Present ViewModel logic
- ViewModel separation
  - Allows framework integration/custom views
- Downloadable on API docs

<!-- .element: class="fragment" data-fragment-index="1" -->

---

# Part III: Extending a View

- Why? <!-- .element: class="fragment" data-fragment-index="1" -->
  - Reusable <!-- .element: class="fragment" data-fragment-index="2" -->
  - Same ecosystem <!-- .element: class="fragment" data-fragment-index="3" -->
- How? <!-- .element: class="fragment" data-fragment-index="4" -->
  - &shy;<!-- .element: class="fragment" data-fragment-index="5" --> Leveraging `esri/widgets/Widget`
  - API widget views <!-- .element: class="fragment" data-fragment-index="6" -->

---

# Part III: Lets extend a View (presentation)

- View custom LayerFX widget
- Extend the LayerFX widget view
  - Use Esri's design system web components
  - Alter the presentation of the widget

---

# [Esri's design system\*](https://github.com/Esri/calcite-components)

<span style="color:red;">\*Evolved from Esri's calcite style and currently in beta</span>

- Create beautiful, consistent apps faster​
- Web components
  - Custom, reusable, encapsulated HTML tags
  - Quickly build Esri branded, lightweight, and accessible web apps

[CalciteButton](https://esri.github.io/calcite-components/?path=/story/components-button--simple)

```html
<calcite-button>My Button!</calcite-button>
```

---

# Part III: LayerFX Widget

Inspired by [Intro to layer effect](https://developers.arcgis.com/javascript/latest/sample-code/intro-effect-layer/) sample

<a target="_blank" href="https://developers.arcgis.com/javascript/latest/sample-code/intro-effect-layer/"><img src="img/layer-effect-sample.png" /></a>

---

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-4.png" data-background-size="cover" -->

# View LayerFX widget

[Demo Start](../demos/start/)

<a target="_blank" href="../demos/start/"><img src="img/LayerFX.png" height="400" /></a>

---

# Part III: LayerFX Interface

```ts
interface LayerFX extends Accessor {
  layer: Layer;
  readonly effects: Collection<LayerEffect>;
  readonly statements: string;
}

interface LayerEffect {
  enabled: boolean;
  id: "bloom" | "blur" | ... | "sepia";
  values: number[];
  readonly valueTypes: { unit: string; ... }[];
  readonly statement: string;
}
```

---

# ArcGIS API for JavaScript:<br /> Building Your Own Widget

Thursday 8 April 2021 @ 10:15 a.m.

---

<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-4.png" data-background-size="cover" -->

# Extend LayerFX widget

- [Demo Start](../demos/start/)
- [Demo Steps](../demos/start/STEPS.md)

<div><img src="img/LayerFXCalcite.png" height="400" /></div>

---

# Part III: Extending View (presentation) Recap

- Extended an existing widget view
- Replaced render methods
- Altered presentation using Esri's design system: components
- Updated private methods where necessary

---

<!-- Presenter: Franco -->
<!-- .slide: data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-4.png" data-background-size="cover"  -->

# Part III: Let's extend a View (behavior)

- Extend the LayerFX widget view
  - Add a preview section to see the applied effects
  - Use [`Sortable.js`](https://sortablejs.github.io/Sortable/) to allow reordering effects

---

# Part III: Extending View (behavior) Recap

- Extended an existing widget view
- Updated render methods
- Added a code preview block
- Used `Sortable.js` to allow custom drag behavior

---

# Conclusion

- Authored a theme <!-- .element: class="fragment" data-fragment-index="1" -->
- Extended a view <!-- .element: class="fragment" data-fragment-index="2" -->
  - Customized presentation <!-- .element: class="fragment" data-fragment-index="3" -->
  - Added functionality <!-- .element: class="fragment" data-fragment-index="4" -->

---

## Additional Resources

- [Implementing Accessor](https://developers.arcgis.com/javascript/latest/guide/implementing-accessor/index.html)
- [Setting up TypeScript](https://developers.arcgis.com/javascript/latest/guide/typescript-setup/index.html)
- [Widget Development](https://developers.arcgis.com/javascript/latest/guide/custom-widget/index.html)
- [Styling](https://developers.arcgis.com/javascript/latest/guide/styling/)
- [ArcGIS API for JavaScript - next](https://github.com/Esri/feedback-js-api-next)

---

## You might also be interested in...

- ArcGIS API for JavaScript: Building Your Own Widget
- Esri Design System: Build compelling web apps faster using the new web component library
- ArcGIS API for JavaScript: Getting Started with Web Development
- ArcGIS API for JavaScript: Programming Patterns and API Fundamentals
- Accessible Web Mapping Apps: ARIA, WCAG and 508 Compliance

---

# Questions? 🤔

> Where can I find the slides/source?

[bit.ly/customwidgetsds21](http://bit.ly/customwidgetsds21)

> Where can I submit a question?

[bit.ly/askjsapi](http://bit.ly/askjsapi)

---

<section data-markdown data-background="../node_modules/esri-reveal.js-templates/img/2021/dev-summit/bg-5.png">

<img src="../node_modules/esri-reveal.js-templates/img/esri-science-logo-white.png" />
