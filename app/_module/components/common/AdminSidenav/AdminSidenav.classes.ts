export const adminSidenavClass = {
  aside:
    'bg-[#1f1f1f] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col',
  logoPanel:
    'flex h-[80px] items-center justify-center bg-white px-8 lg:h-[80px]',
  logoLink: 'flex w-[120px] items-center justify-center',
  mobileNav:
    'flex gap-1 overflow-x-auto border-y border-white/10 bg-[#1f1f1f] p-3 lg:hidden',
  desktopNav: 'hidden flex-1 flex-col pt-0 lg:flex',
  navList: 'flex flex-1 flex-col',
  navItem:
    'flex h-[54px] items-center gap-3 px-7 text-[14px] font-normal text-white transition-colors hover:bg-white/10',
  activeNavItem: 'bg-core-blue text-white hover:bg-core-blue',
  mobileNavItem:
    'flex min-w-fit items-center gap-2 rounded-sm px-4 py-3 text-sm text-white transition-colors hover:bg-white/10',
  mobileActiveNavItem: 'bg-core-blue',
  icon: 'h-[17px] w-[17px] shrink-0',
  footer: 'hidden px-5 pb-8 lg:block',
  profile:
    'flex items-center gap-3 rounded-[8px] bg-white px-3 py-3 text-[#1e1e1e]',
  avatar:
    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-core-blue text-xs font-medium text-white',
  profileName: 'text-sm font-medium leading-5 text-core-blue',
  profileRole: 'text-[11px] leading-5 text-[#474C52]',
};
