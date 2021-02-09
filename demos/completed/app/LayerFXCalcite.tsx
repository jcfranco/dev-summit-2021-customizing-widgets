import LayerFX from "./LayerFX";
import { tsx } from "esri/widgets/support/widget";
import { subclass } from "esri/core/accessorSupport/decorators";
import { CSS } from "./resources";
import LayerEffect from "./LayerEffect";
import Sortable from "sortablejs";

@subclass("esri.demo.LayerFX")
class LayerFXCalcite extends LayerFX {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  destroy() {
    this._sortable?.destroy();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _sortable: Sortable;

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
          afterCreate={this.initSortable}
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
          {statements ? <pre>{statements}</pre> : <p>Turn on an effect to see some code</p>}
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

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private initSortable = (el: HTMLElement) => {
    if (!this._sortable) {
      this._sortable = new Sortable(el, {
        draggable: `calcite-block-section`,
        onEnd: (event) => {
          this.viewModel.effects.reorder(event.item["data-effect"], event.newIndex);
        }
      });
    }
  };

  private updateEnabledCustom = (event: CustomEvent) => {
    const target = event.currentTarget as HTMLCalciteBlockSectionElement;
    const effect: LayerEffect = target["data-effect"];
    effect.enabled = !!target.open;
  };

  private updateValueCustom = (event: CustomEvent, effect: LayerEffect, index: number) => {
    const target = event.currentTarget as HTMLCalciteSliderElement;
    const value = effect.values.slice();
    value[index] = target.value;
    effect.values = value;
  };
}

export = LayerFXCalcite;
