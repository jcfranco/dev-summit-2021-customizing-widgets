define(["require", "exports", "tslib", "./LayerFX", "esri/widgets/support/widget", "esri/core/accessorSupport/decorators", "./resources", "sortablejs"], function (require, exports, tslib_1, LayerFX_1, widget_1, decorators_1, resources_1, sortablejs_1) {
    "use strict";
    LayerFX_1 = tslib_1.__importDefault(LayerFX_1);
    sortablejs_1 = tslib_1.__importDefault(sortablejs_1);
    var LayerFXCalcite = /** @class */ (function (_super) {
        tslib_1.__extends(LayerFXCalcite, _super);
        function LayerFXCalcite() {
            //--------------------------------------------------------------------------
            //
            //  Lifecycle
            //
            //--------------------------------------------------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            //--------------------------------------------------------------------------
            //
            //  Protected Methods
            //
            //--------------------------------------------------------------------------
            _this.renderCodeAccordion = function () {
                var statements = _this.viewModel.statements;
                return (widget_1.tsx("calcite-accordion", null,
                    widget_1.tsx("calcite-accordion-item", { "item-title": "Effect code", icon: "code" }, statements ? widget_1.tsx("pre", null, statements) : widget_1.tsx("p", null, "Turn on an effect to see some code"))));
            };
            _this.renderEffectSliderLabel = function (_a) {
                var enabled = _a.enabled, name = _a.name, min = _a.min, max = _a.max, value = _a.value, oninput = _a.oninput;
                return (widget_1.tsx("calcite-label", null,
                    name,
                    ":",
                    widget_1.tsx("calcite-slider", { disabled: !enabled, min: min, max: max, value: value, afterCreate: function (el) {
                            el.addEventListener("calciteSliderUpdate", oninput);
                        }, afterRemoved: function (el) {
                            el.removeEventListener("calciteSliderUpdate", oninput);
                        } })));
            };
            _this.renderEffectValue = function (effect, value, index) {
                var valueTypes = effect.valueTypes, enabled = effect.enabled;
                var valueType = valueTypes[index];
                var min = valueType.min, max = valueType.max, id = valueType.id;
                return _this.renderEffectSliderLabel({
                    enabled: enabled,
                    name: id ? _this.messages[id] : _this.messages.value,
                    min: min,
                    max: max,
                    value: value,
                    oninput: function (event) { return _this.updateValueCustom(event, effect, index); }
                });
            };
            _this.renderEffect = function (effect) {
                return (widget_1.tsx("calcite-block-section", { text: _this.messages[effect.id], "data-effect": effect, key: effect.id, open: effect.enabled, "toggle-display": "switch", afterCreate: function (el) {
                        return el.addEventListener("calciteBlockSectionToggle", _this.updateEnabledCustom);
                    }, afterRemoved: function (el) {
                        return el.removeEventListener("calciteBlockSectionToggle", _this.updateEnabledCustom);
                    } },
                    widget_1.tsx("div", { class: "block-content" }, _this.renderEffectValues(effect))));
            };
            //--------------------------------------------------------------------------
            //
            //  Private Methods
            //
            //--------------------------------------------------------------------------
            _this.initSortable = function (el) {
                if (!_this._sortable) {
                    _this._sortable = new sortablejs_1.default(el, {
                        draggable: "calcite-block-section",
                        onEnd: function (event) {
                            _this.viewModel.effects.reorder(event.item["data-effect"], event.newIndex);
                        }
                    });
                }
            };
            _this.updateEnabledCustom = function (event) {
                var target = event.currentTarget;
                var effect = target["data-effect"];
                effect.enabled = !!target.open;
            };
            _this.updateValueCustom = function (event, effect, index) {
                var target = event.currentTarget;
                var value = effect.values.slice();
                value[index] = target.value;
                effect.values = value;
            };
            return _this;
        }
        LayerFXCalcite.prototype.destroy = function () {
            var _a;
            (_a = this._sortable) === null || _a === void 0 ? void 0 : _a.destroy();
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        LayerFXCalcite.prototype.render = function () {
            var _a = this.viewModel, effects = _a.effects, state = _a.state;
            return (widget_1.tsx("div", { class: this.classes(resources_1.CSS.root, resources_1.CSS.esriWidget, resources_1.CSS.esriWidgetPanel) },
                widget_1.tsx("calcite-block", { afterCreate: this.initSortable, open: true, heading: this.messages.title, summary: this.messages.summary, disabled: state === "disabled", loading: state === "loading", theme: "dark" },
                    effects.map(this.renderEffect).toArray(),
                    this.renderCodeAccordion())));
        };
        LayerFXCalcite = tslib_1.__decorate([
            decorators_1.subclass("esri.demo.LayerFX")
        ], LayerFXCalcite);
        return LayerFXCalcite;
    }(LayerFX_1.default));
    return LayerFXCalcite;
});
//# sourceMappingURL=LayerFXCalcite.js.map