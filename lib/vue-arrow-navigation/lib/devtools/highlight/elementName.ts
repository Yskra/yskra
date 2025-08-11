import type { ComponentInternalInstance } from 'vue';

const classifyRE = /(?:^|[-_/])(\w)/g;

interface VueAppInstanceBase extends ComponentInternalInstance {
  type: {
    name: string;
    _componentTag: string | undefined;
    components: Record<string, ComponentInternalInstance['type']>;
    // noinspection SpellCheckingInspection
    __VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__: string;
    __name: string;
    __file: string;
  };
}

interface VueAppInstance extends VueAppInstanceBase {
  parent: VueAppInstanceBase;
}

export function getElementName(element: Element) {
  return '__vueParentComponent' in element ? getInstanceName(element.__vueParentComponent as any) : `${element.tagName}#${element.id}`;
}

function getInstanceName(instance: VueAppInstance) {
  const name = getComponentTypeName(instance?.type || {});

  if (name)
    return name;
  if (instance?.root === instance)
    return 'Root';
  for (const key in instance.parent?.type?.components) {
    if (instance.parent.type.components[key] === instance?.type)
      return key;
  }

  for (const key in instance.appContext?.components) {
    if (instance.appContext.components[key] === instance?.type)
      return key;
  }

  const fileName = getComponentFileName(instance?.type || {});

  if (fileName)
    return fileName;

  return 'Anonymous Component';
}

function getComponentTypeName(options: VueAppInstance['type']) {
  const name = options.name || options._componentTag || options.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || options.__name;

  if (name === 'index' && options.__file?.endsWith('index.vue')) {
    return '';
  }
  return name;
}

function getComponentFileName(options: VueAppInstance['type']) {
  const file = options.__file;

  if (file)
    return classify(basename(file, '.vue'));
}

function basename(filename: string, ext: string): string {
  let normalizedFilename = filename.replace(/^[a-z]:/i, '').replace(/\\/g, '/');

  if (normalizedFilename.endsWith(`index${ext}`)) {
    normalizedFilename = normalizedFilename.replace(`/index${ext}`, ext);
  }
  const lastSlashIndex = normalizedFilename.lastIndexOf('/');
  const baseNameWithExt = normalizedFilename.substring(lastSlashIndex + 1);

  if (ext) {
    const extIndex = baseNameWithExt.lastIndexOf(ext);

    return baseNameWithExt.substring(0, extIndex);
  }
  return '';
}

function classify(str: string) {
  return str && (`${str}`).replace(classifyRE, toUpper);
}

function toUpper(_: string, c: string) {
  return c ? c.toUpperCase() : '';
}
