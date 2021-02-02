import LayerFX = require("./LayerFX");
import { tsx } from "esri/widgets/support/widget";
import { subclass } from "esri/core/accessorSupport/decorators";
import { CSS } from "./resources";
import LayerEffect = require("./LayerEffect");

@subclass("esri.demo.LayerFX")
class LayerFXCalcite extends LayerFX {
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
          {this.renderCodeAccordion()}
        </calcite-block>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Protected Methods
  //
  //--------------------------------------------------------------------------

  protected renderCodeAccordion = () => {
    const { statements } = this.viewModel;

    return (
      <calcite-accordion>
        <calcite-accordion-item item-title="Effect code" icon="code">
          {statements ? <pre>{statements}</pre> : <p>No code to display.</p>}
        </calcite-accordion-item>
      </calcite-accordion>
    );
  };

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

  protected renderEffectValue = (effect: LayerEffect, value: number, index: number) => {
    const { valueTypes, enabled } = effect;
    const valueType = valueTypes[index];
    const { name, min, max } = valueType;

    return this.renderEffectSliderLabel({
      enabled,
      name: name || this.messages.value,
      min,
      max,
      value,
      oninput: (event: CustomEvent) => this.updateValueCustom(event, effect, index)
    });
  };

  protected renderEffectEnabledLabel = (effect: LayerEffect) => {
    const { enabled } = effect;

    return (
      <calcite-label layout="inline">
        {this.messages.enabled}:
        <calcite-switch
          switched={enabled}
          afterCreate={(el: HTMLElement) => {
            el.addEventListener("calciteSwitchChange", (event: CustomEvent) =>
              this.updateEnabledCustom(event, effect)
            );
          }}
          afterRemoved={(el: HTMLElement) => {
            el.removeEventListener("calciteSwitchChange", (event: CustomEvent) =>
              this.updateEnabledCustom(event, effect)
            );
          }}
        />
      </calcite-label>
    );
  };

  protected renderEffect = (effect: LayerEffect) => {
    return (
      <calcite-block-section
        text={this.messages[effect.id]}
        toggle-display="switch"
        afterCreate={(el: HTMLElement) => {
          el.addEventListener("calciteBlockSectionToggle", (event: CustomEvent) =>
            this.updateEnabledCustom(event, effect)
          );
        }}
        afterRemoved={(el: HTMLElement) => {
          el.removeEventListener("calciteBlockSectionToggle", (event: CustomEvent) =>
            this.updateEnabledCustom(event, effect)
          );
        }}
      >
        <div class="block-content">{this.renderEffectValues(effect)}</div>
      </calcite-block-section>
    );
  };

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private updateEnabledCustom = (event: CustomEvent, effect: LayerEffect) => {
    const target = event.target as any;
    effect.enabled = !!target.open;
  };

  private updateValueCustom = (event: CustomEvent, effect: LayerEffect, index: number) => {
    const target = event.target as any;
    const value = effect.values.slice();
    value[index] = parseInt(target.value, 10);
    effect.values = value;
  };
}

export = LayerFXCalcite;
