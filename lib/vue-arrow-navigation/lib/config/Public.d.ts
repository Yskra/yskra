import type { Directive, DirectiveBinding } from 'vue';

type Modifiers = 'autofocus';

export type FocusSectionDirective = Directive<Element, SectionConfig, Modifiers>;
export type DirectiveSectionConfigBinning = DirectiveBinding<SectionConfig, Modifiers>;

export type FocusDirective = Directive<Element, FocusConfig | boolean, Modifiers>;
export type DirectiveFocusConfigBinning = DirectiveBinding<FocusConfig | boolean, Modifiers>;

export interface SectionConfig {
  autofocus: boolean;
}

export interface FocusConfig {
  autofocus: boolean;
  enabled: boolean;
}
