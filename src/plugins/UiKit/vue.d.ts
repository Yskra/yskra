import type { UseImage, vOnClickOutside } from '@vueuse/components';
import type { VNode } from 'vue';
import type { AllowedComponentProps, ComponentCustomProps, VNodeProps } from 'vue';
import type { RouterLink } from 'vue-router';
import type BaseFilterItem from './lib/base-filter-item.vue';

import type BaseSelectItem from './lib/base-select-item.vue';
import type BaseSelect from './lib/base-select.vue';
import type FilmCard from './lib/film-card/index.vue';
import type Index from './lib/y-carousel/index.vue';
import type YConfirm from './lib/y-confirm.vue';
import type YDialog from './lib/y-dialog.vue';
import type YDrawer from './lib/y-drawer.vue';
import type YModal from './lib/y-modal.vue';
import type YPrompt from './lib/y-prompt.vue';
import type YSlider from './lib/y-slider.vue';
import type { DaisyUIType } from '@/plugins/UiKit/Public';

type ComponentProps = AllowedComponentProps & ComponentCustomProps & VNodeProps;
type BaseProps = ComponentProps;

interface BaseSlots {
  default: () => VNode[];
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    vClickOutside: typeof vOnClickOutside;
  }
}

declare module 'vue' {
  const EmptyComponent: new () => {
    $props: ComponentProps;
  };

  const UIKitLayout: new () => {
    $slots: BaseSlots;
  };

  const UIKitBaseBadge: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      styling?: DaisyUIType;
      size?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseButton: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      styling?: DaisyUIType;
      size?: DaisyUIType;
      modifier?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseCard: new () => {
    $props: BaseProps & {
      styling?: DaisyUIType;
      size?: DaisyUIType;
      modifier?: DaisyUIType;
    };
    $slots: BaseSlots & {
      title: () => VNode[];
      figure: () => VNode[];
      actions: () => VNode[];
    };
  };

  const UIKitBaseCollapse: new () => {
    $props: BaseProps & {
      modifier?: DaisyUIType;
    };
    $slots: BaseSlots & {
      title: () => VNode[];
    };
  };

  const UIKitBaseDivider: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      direction?: DaisyUIType;
      placement?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseFilter: new () => {
    $slots: BaseSlots;
  };

  const UIKitBaseInput: new () => {
    $props: BaseProps & {
      styling?: DaisyUIType;
      color?: DaisyUIType;
      size?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseLabel: new () => {
    $props: BaseProps & {
      styling?: DaisyUIType;
    };
    $slots: BaseSlots & {
      'label-start': () => VNode[];
      'label-end': () => VNode[];
    };
  };

  const UIKitBaseLink: new () => {
    $props: BaseProps & {
      styling?: DaisyUIType;
      color?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseMenu: new () => {
    $props: BaseProps & {
      type?: string;
      size?: DaisyUIType;
      direction?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseMenuItem: new () => {
    $props: BaseProps & {
      type?: DaisyUIType;
      modifier?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseProgress: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      max?: number;
      value?: number;
    };
  };

  const UIKitBaseSlider: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      size?: DaisyUIType;
    };
  };

  const UIKitBaseTable: new () => {
    $props: BaseProps & {
      size?: DaisyUIType;
      modifier?: DaisyUIType;
    };
  };

  const UIKitBaseTabs: new () => {
    $props: BaseProps & {
      type?: DaisyUIType;
      size?: DaisyUIType;
      placement?: DaisyUIType;
      styling?: DaisyUIType;
    };
    $slots: BaseSlots;
  };

  const UIKitBaseTabsItem: new () => {
    $props: BaseProps & {
      modifier?: DaisyUIType;
    };
    $slots: BaseSlots & {
      tab: () => VNode[];
    };
  };

  const UIKitBaseToggle: new () => {
    $props: BaseProps & {
      color?: DaisyUIType;
      size?: DaisyUIType;
    };
  };

  const UIKitBaseTooltip: new () => {
    $props: BaseProps & {
      'color'?: DaisyUIType;
      'modifier'?: DaisyUIType;
      'placement'?: DaisyUIType;
      'data-tip': string;
    };
    $slots: BaseSlots & {
      content?: () => VNode[];
    };
  };

  const UIKitGlobalLayoutSidebar: new () => {
    $slots: BaseSlots & {
      sidebar: () => VNode[];
    };
  };

  const UIKitGlobalComponentIcon: new () => {
    $props: BaseProps & {
      name: string;
    };
  };

  // noinspection JSUnusedGlobalSymbols
  export interface GlobalComponents {
    UseImage: typeof UseImage;

    AppLink: typeof RouterLink;

    BaseBadge: typeof UIKitBaseBadge;
    BaseButton: typeof UIKitBaseButton;
    BaseCard: typeof UIKitBaseCard;
    BaseCollapse: typeof UIKitBaseCollapse;
    BaseDivider: typeof UIKitBaseDivider;
    BaseFilter: typeof UIKitBaseFilter;
    BaseFilterItem: typeof BaseFilterItem;
    BaseInput: typeof UIKitBaseInput;
    BaseLabel: typeof UIKitBaseLabel;
    BaseLink: typeof UIKitBaseLink;
    BaseLoading: typeof EmptyComponent;
    BaseMenu: typeof UIKitBaseMenu;
    BaseMenuItem: typeof UIKitBaseMenuItem;
    BasePassword: typeof EmptyComponent;
    BaseProgress: typeof UIKitBaseProgress;
    BaseSelect: typeof BaseSelect;
    BaseSelectItem: typeof BaseSelectItem;
    BaseSkeleton: typeof EmptyComponent;
    BaseSlider: typeof UIKitBaseSlider;
    BaseTable: typeof UIKitBaseTable;
    BaseTabs: typeof UIKitBaseTabs;
    BaseTabsItem: typeof UIKitBaseTabsItem;
    BaseToggle: typeof UIKitBaseToggle;
    BaseTooltip: typeof UIKitBaseTooltip;
    BaseUsername: typeof EmptyComponent;

    YConfirm: typeof YConfirm;
    YDialog: typeof YDialog;
    YDrawer: typeof YDrawer;
    YGrid: typeof Index;
    YModal: typeof YModal;
    YPrompt: typeof YPrompt;
    YSlider: typeof YSlider;
    YCarousel: typeof Index;

    FilmCard: typeof FilmCard;
    Icon: typeof UIKitGlobalComponentIcon;

    BackgroundImageLayout: typeof UIKitLayout;
    BaseLayout: typeof UIKitLayout;
    DialogLayout: typeof UIKitLayout;
    SidebarLayout: typeof UIKitGlobalLayoutSidebar;
  }
}
