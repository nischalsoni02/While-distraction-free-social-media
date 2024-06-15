// components/Header.tsx
import {
  AppShell,
  Burger,
  Group,
  Stack,
  Tooltip,
  UnstyledButton,
  rem
} from '@mantine/core';
import Link from 'next/link';
import { useDisclosure } from '@mantine/hooks';
import styles from './Header.module.css';
import { useState } from 'react';
import { auth } from '../../firebase/config/Firebase';
import {
  IconHome2,
  IconDeviceDesktopAnalytics,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconSearch,
  IconMessage
} from '@tabler/icons-react';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void; // Optional onClick handler
}

function NavbarLink({ icon: Icon, label, href, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link href={href}>
        <UnstyledButton onClick={onClick} className={styles.link} data-active={active || undefined}>
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  );
}

const Header = () => {
  const [opened, { toggle }] = useDisclosure();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log("Logged out successfully");
    } catch (error) {
      console.error('Error logging out:', (error as Error).message);
    }
  };

  const links = [
    { icon: IconHome2, label: 'Home', href: '/' },
    { icon: IconDeviceDesktopAnalytics, label: 'Loops', href: '/loops' },
    { icon: IconMessage, label: 'Messages', href: '/message' },
    { icon: IconCalendarStats, label: 'Create', href: '/create' },
    { icon: IconSearch, label: 'Explore', href: '/explore' },
    { icon: IconUser, label: 'Profile', href: '/profile' },
    { icon: IconSettings, label: 'Settings', href: '/settings' }
  ].map((link, index) => (
    <NavbarLink
      key={link.label}
      icon={link.icon}
      label={link.label}
      href={link.href}
      active={index === activeIndex}
      onClick={() => setActiveIndex(index)}
    />
  ));

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 200, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <img className={styles.logoImage} src="assets/Images/logo.png" alt="" />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className={styles.navbarMain}>
          <Stack justify="center" gap={0}>
            {links}
          </Stack>
        </div>
        <Stack justify="center" gap={0}>
          <NavbarLink href="#" icon={IconSwitchHorizontal} label="Change account" />
          <NavbarLink href="#" onClick={handleLogout} icon={IconLogout} label="Logout" />
        </Stack>
      </AppShell.Navbar>
    </AppShell>
  );
};

export default Header;
