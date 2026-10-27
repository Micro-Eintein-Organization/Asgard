import React, { useState } from 'react';
import { EntryChoice } from './EntryChoice';
import { DiscoveryWizard } from './DiscoveryWizard';
import RoleCatalog from '../catalog/RoleCatalog';
import OptionalProfileSetup from '../profile/OptionalProfileSetup';

export default function DiscoveryContainer() {
  const [mode, setMode] = useState<'entry' | 'wizard' | 'catalog' | 'profile-setup'>('entry');

  if (mode === 'wizard') {
    return (
      <DiscoveryWizard
        onReturnToEntry={() => setMode('entry')}
        onSkipToCatalog={() => setMode('catalog')}
        onProceedToProfile={() => setMode('profile-setup')}
      />
    );
  }

  if (mode === 'catalog') {
    return (
      <RoleCatalog
        onBack={() => setMode('entry')}
        onSelectRole={() => setMode('profile-setup')}
      />
    );
  }

  if (mode === 'profile-setup') {
    return (
      <OptionalProfileSetup
        onBack={() => setMode('catalog')}
        onProceed={() => window.location.href = '/dashboard'}
        onSkip={() => window.location.href = '/dashboard'}
      />
    );
  }

  return <EntryChoice onSelectChoice={(choice) => setMode(choice)} />;
}