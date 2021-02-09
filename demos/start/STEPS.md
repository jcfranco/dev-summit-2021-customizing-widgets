# Custom Widget Steps

Steps to create a custom widget!

## Explore the file structure

## Preview the index page

## Get calcite

## Add calcite

```html
<script type="module" src="https://unpkg.com/@esri/calcite-components/dist/calcite/calcite.esm.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/@esri/calcite-components/dist/calcite/calcite.css" />
```

```html
<div style="position:absolute; top:20px; left:100px; z-index: 999;">
  <calcite-button>Hello World!</calcite-button>
</div>
```

## Update CSS

```css
.layer-fx calcite-block {
  margin: 0;
}

.layer-fx .block-content {
  padding: 1.5rem;
}

.layer-fx pre {
  border: 1px solid grey;
  font-size: 0.75rem;
  border-left: 4px solid green;
  border-radius: 3px;
  margin: 1rem 0 0 0;
  padding: 0.5rem;
  background-color: #333;
  overflow: auto;
  max-height: 100px;
}

.layer-fx p {
  margin-bottom: 0;
}
```

## Start build

1.  Let's build our app by running the TypeScript compiler and enabling the `watch` flag

```
tsc -w
```

## Start building LayerFXCalcite

### Override public render method

```tsx
//--------------------------------------------------------------------------
//
//  Public Methods
//
//--------------------------------------------------------------------------

render() {
  const { effects, state } = this.viewModel;

  return (
    <div class={this.classes(CSS.root, CSS.esriWidget, CSS.esriWidgetPanel)}>
      <calcite-block
        open
        heading={this.messages.title}
        summary={this.messages.summary}
        disabled={state === "disabled"}
        loading={state === "loading"}
        theme="dark"
      >
        {effects.map(this.renderEffect).toArray()}
      </calcite-block>
    </div>
  );
}
```

### Add missing import

```
import { CSS } from "./resources";
```

### Replace the fieldsets with CalciteBlockItems

```tsx
//--------------------------------------------------------------------------
//
//  Protected Methods
//
//--------------------------------------------------------------------------

protected renderEffect = (effect: LayerEffect) => {
  return (
    <calcite-block-section
      text={this.messages[effect.id]}
      data-effect={effect}
      key={effect.id}
      open={effect.enabled}
      toggle-display="switch"
      afterCreate={(el: HTMLElement) =>
        el.addEventListener("calciteBlockSectionToggle", this.updateEnabledCustom)
      }
      afterRemoved={(el: HTMLElement) =>
        el.removeEventListener("calciteBlockSectionToggle", this.updateEnabledCustom)
      }
    >
      <div class="block-content">{this.renderEffectValues(effect)}</div>
    </calcite-block-section>
  );
};
```

### Add private method for updating enabled

```tsx
//--------------------------------------------------------------------------
//
//  Private Methods
//
//--------------------------------------------------------------------------

private updateEnabledCustom = (event: CustomEvent) => {
  const target = event.currentTarget as HTMLCalciteBlockSectionElement;
  const effect: LayerEffect = target["data-effect"];
  effect.enabled = !!target.open;
};
```

### Replace native sliders with CalciteSlider

```tsx
protected renderEffectValue = (effect: LayerEffect, value: number, index: number) => {
  const { valueTypes, enabled } = effect;
  const valueType = valueTypes[index];
  const { min, max, id } = valueType;

  return this.renderEffectSliderLabel({
    enabled,
    name: id ? this.messages[id] : this.messages.value,
    min,
    max,
    value,
    oninput: (event: CustomEvent) => this.updateValueCustom(event, effect, index)
  });
};
```

### Add updateValueCustom private method

```tsx
private updateValueCustom = (event: CustomEvent, effect: LayerEffect, index: number) => {
  const target = event.currentTarget as HTMLCalciteSliderElement;
  const value = effect.values.slice();
  value[index] = target.value;
  effect.values = value;
};
```

### Override `renderEffectSliderLabel`

```tsx
protected renderEffectSliderLabel = ({
  enabled,
  name,
  min,
  max,
  value,
  oninput
}: {
  enabled: boolean;
  value: number;
  min: number;
  max: number;
  name: string;
  oninput: (event: Event) => void;
}) => {
  return (
    <calcite-label>
      {name}:
      <calcite-slider
        disabled={!enabled}
        min={min}
        max={max}
        value={value}
        afterCreate={(el: HTMLElement) => {
          el.addEventListener("calciteSliderUpdate", oninput);
        }}
        afterRemoved={(el: HTMLElement) => {
          el.removeEventListener("calciteSliderUpdate", oninput);
        }}
      />
    </calcite-label>
  );
};
```

## Complete

Lets go back to slides to review.
