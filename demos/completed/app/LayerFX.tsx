import { aliasOf, property, subclass } from "esri/core/accessorSupport/decorators";
import { messageBundle, tsx } from "esri/widgets/support/widget";
import { EffectLayer, LayerFXWidgetProperties } from "./interfaces";
import { CSS } from "./resources";
import LayerFXViewModel = require("./LayerFXViewModel");
import LayerEffect = require("./LayerEffect");
import Widget = require("esri/widgets/Widget");

@subclass("esri.demo.LayerFX")
class LayerFX extends Widget {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(props: LayerFXWidgetProperties) {
    super(props);
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  layer
  //----------------------------------

  @aliasOf("viewModel.layer")
  layer: EffectLayer;

  //----------------------------------
  //  messages
  //----------------------------------

  @property()
  @messageBundle("esri/demo/app/t9n/LayerFX")
  messages: Record<string, string>;

  //----------------------------------
  //  viewModel
  //----------------------------------

  @property()
  viewModel: LayerFXViewModel = new LayerFXViewModel();

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  render() {
    const { effects, state, statements } = this.viewModel;

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
          <div class="code-container">
            <calcite-button
              disabled={!statements}
              color={this._showCode ? "dark" : "blue"}
              scale="s"
              floating
              icon-start="code"
              onclick={() => (this._showCode = !this._showCode)}
            />
            {this._showCode && statements ? <pre>{statements}</pre> : null}
          </div>

          {effects.map(this.renderEffect).toArray()}
        </calcite-block>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  @property()
  private _showCode = false;

  //--------------------------------------------------------------------------
  //
  //  Protected Methods
  //
  //--------------------------------------------------------------------------

  private renderEffectSliderLabel = ({
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
      oninput: (event: CustomEvent) => this.updateValue(event, effect, index)
    });
  };

  protected renderEffectValues = (effect: LayerEffect) => {
    return effect.values?.map((value, index) => this.renderEffectValue(effect, value, index));
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
              this.updateEnabled(event, effect)
            );
          }}
          afterRemoved={(el: HTMLElement) => {
            el.removeEventListener("calciteSwitchChange", (event: CustomEvent) =>
              this.updateEnabled(event, effect)
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
            this.updateEnabled(event, effect)
          );
        }}
        afterRemoved={(el: HTMLElement) => {
          el.removeEventListener("calciteBlockSectionToggle", (event: CustomEvent) =>
            this.updateEnabled(event, effect)
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

  private updateEnabled = (event: CustomEvent, effect: LayerEffect) => {
    const target = event.target as any;
    effect.enabled = !!target.open;
  };

  private updateValue = (event: CustomEvent, effect: LayerEffect, index: number) => {
    const target = event.target as any;
    const value = effect.values.slice();
    value[index] = parseInt(target.value, 10);
    effect.values = value;
  };
}

export = LayerFX;
