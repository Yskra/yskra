import type { ResolveSection } from '../navigation';
import type { NavigationGuard } from '../navigation-guards';
import { onActivated, onDeactivated, onUnmounted } from 'vue';
import { useArrowNavigation } from './index';

export function onBeforeANSectionLeave(leaveGuard: NavigationGuard<ResolveSection>) {
  const navigation = useArrowNavigation();
  let remove = navigation.beforeEachSection(leaveGuard);
  const reAdd = () => remove = navigation.beforeEachSection(leaveGuard);

  onUnmounted(remove);
  onDeactivated(remove);
  onActivated(reAdd);
}
