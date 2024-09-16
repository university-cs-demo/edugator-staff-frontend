import React, { useEffect, useState } from "react";
import { CaretDown } from "phosphor-react";
import AnimateHeight from "react-animate-height";
import { useRouter } from "next/router";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Switch from "@radix-ui/react-switch";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useTheme } from "next-themes";

import { EdugatorLogo, icons } from "./navIcons";
import { ContentType } from "components/PlaygroundLayout/PlaygroundLayout";
import { classes, NavLink, navLinks, NavLinkText } from "./navigationData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "lib/store/store";
import {
  setMainSidebarHidden,
  setContentSidebarHidden,
} from "state/interfaceControls.slice";
import Link from "next/link";

const Divider = () => {
  return <div className="w-full h-px bg-slate-600"></div>;
};

const NavLink = ({
  icon,
  text,
  open,
  active,
  onClick,
}: {
  icon: (active: boolean) => React.ReactNode;
  text: NavLinkText;
  open: boolean;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <NavLinkTooltip text={text} disabled={open}>
      <button
        onClick={() => {
          onClick();
        }}
        className={`w-full h-12 rounded-md overflow-hidden box-border flex items-center justify-start px-[14px] group space-x-4 ${
          active
            ? "bg-emerald-500/10 ring-emerald-500/40 ring-2 text-white font-medium"
            : "text-nav-inactive-light hover:bg-emerald-500/5"
        }`}
      >
        <div className="w-5 h-5 min-w-[20px]">{icon(active)}</div>
        <label
          className={`text-sm group-hover:text-white pointer-events-none transition text-ellipsis whitespace-nowrap ${
            open ? "opacity-100" : "opacity-0"
          }`}
        >
          {text}
        </label>
      </button>
    </NavLinkTooltip>
  );
};

const NavLinkTooltip = ({
  text,
  children,
  disabled,
}: {
  text: string;
  children: React.ReactNode;
  disabled: boolean;
}) => {
  const [open, setOpen] = useState(false);

  // hide tooltip on sidebar collapse
  useEffect(() => {
    if (!disabled) setOpen(false);
  }, [disabled]);

  return (
    <Tooltip.Provider disableHoverableContent={disabled} delayDuration={150}>
      <Tooltip.Root open={disabled ? false : open} onOpenChange={setOpen}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="right"
            className="TooltipContent z-[100] data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade text-sm font-dm select-none rounded-[4px] bg-nav-darker border border-slate-700 text-slate-300 px-3 py-2 leading-none will-change-[transform,opacity]"
            sideOffset={10}
          >
            {text}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const SideNavigation = ({
  activeContent,
  setActiveContent,
}: {
  activeContent: ContentType;
  setActiveContent: (activeContent: ContentType) => void;
}) => {
  const [activeLink, setActiveLink] = useState<NavLink>(navLinks[1]);
  const [activeClass, setActiveClass] = useState(0);
  const [mounted, setMounted] = useState(false);

  const { mainSidebarHidden, contentSidebarHidden } = useSelector(
    (state: RootState) => state.interfaceControls
  );

  const dispatch = useDispatch();

  const toggleMainSidebar = (hidden: boolean) => {
    dispatch(setMainSidebarHidden(hidden));
  };

  const toggleContentSidebar = (hidden: boolean) => {
    dispatch(setContentSidebarHidden(hidden));
  };

  useEffect(() => {
    // used to fix hydration mismatch with theme toggle
    setMounted(true);
  }, []);

  //if navlink has toggleExercises attribute, then it will toggle the exercises sidebar
  //create array with just these links
  const toggleExercisesLinks = navLinks.filter((link) => link.toggleExercises);

  useEffect(() => {
    // whenever activeContent changes (from content sidebar), update active link in main side nav
    if (toggleExercisesLinks.map((link) => link.id).includes(activeContent)) {
      setActiveLink(
        (toggleExercisesLinks.find(
          (link) => link.id === activeContent
        ) as NavLink) || navLinks[1]
      );
    }
  }, [activeContent]);

  const router = useRouter();
  const { pathname } = router;

  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <nav
      className={`flex font-dm overflow-hidden h-full bg-nav-darker dark:bg-[#212b3b] flex-col items-center justify-start`}
    >
      {/* Logo */}
      <div className="flex items-center h-16 w-full bg-gradient-to-tl from-nav-darker dark:from-[#212b3b] dark:via-[#212b3b] dark:to-emerald-700/40 via-nav-darker to-emerald-900/40 px-3">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-12 h-12 min-w-[3rem] p-1 flex items-center mr-2">
              <EdugatorLogo />
            </div>

            <h1
              className={`text-white font-ambit text-xl mt-1 overflow-hidden text-ellipsis transition-opacity ${
                !mainSidebarHidden ? "opacity-100" : "opacity-0"
              }`}
            >
              Edugator
            </h1>
          </div>
        </Link>
      </div>
      {/* Main Sidebar Content */}
      <div className="h-full flex flex-col items-center justify-between py-4 w-full px-4">
        {/* Top Group */}
        <section className="w-full flex flex-col space-y-4">
          {/* Class Group */}
          {/* <div
            className={`flex flex-col space-y-3 transition-all rounded-md ${
              !mainSidebarHidden
                ? "p-2 bg-nav-darkest ring-2 ring-[#060b14]"
                : "p-0"
            }`}
          >
            {classes.map((item, index) => (
              <NavLinkTooltip
                text={`${item.name}: ${item.course}`}
                disabled={!mainSidebarHidden}
                key={index}
              >
                <div
                  onClick={() => {
                    setActiveClass(index);
                    toggleMainSidebar(!mainSidebarHidden);
                  }}
                  className={`w-full flex p-1 transition-all hover:bg-blue-500/10 items-center relative ${
                    activeClass === index && mainSidebarHidden
                      ? "ring-2 ring-blue-500"
                      : ""
                  } ${
                    activeClass === index && !mainSidebarHidden
                      ? "bg-blue-500/10"
                      : ""
                  } ${!mainSidebarHidden ? "rounded-sm" : "rounded-md"}`}
                >
                  <div className="!max-h-[48px] !max-w-[48px] h-full !min-w-[40px]">
                    <AspectRatio.Root
                      ratio={1 / 1}
                      asChild
                      className="rounded-sm relative"
                    >
                      <Image src={item.icon} layout="fill" objectFit="cover" alt={item.name}/>
                    </AspectRatio.Root>
                  </div>
                  <section
                    className={`flex ml-3 justify-center h-full flex-col whitespace-nowrap overflow-hidden text-left leading-none transition-opacity ${
                      !mainSidebarHidden ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h1
                      className={`font-bold text-white overflow-hidden text-ellipsis text-sm`}
                    >
                      {item.name}
                    </h1>
                    <p
                      className={`text-white/70 text-xs overflow-hidden text-ellipsis`}
                    >
                      {item.course}
                    </p>
                  </section>
                </div>
              </NavLinkTooltip>
            ))}
            <NavLinkTooltip disabled={!mainSidebarHidden} text="Add Class">
              <div role="button" tabIndex={0}
                className={`w-full rounded-sm relative transition overflow-hidden cursor-pointer px-1 flex items-center group justify-start h-10`}
              >
                <div
                  className={`h-10 w-10 min-w-[2.5rem] rounded-full transition-all items-center justify-center flex ${
                    !mainSidebarHidden ? "bg-white/5" : "group-hover:bg-white/5"
                  }`}
                >
                  <div className="w-3 h-3 min-w-[.75rem]">
                    {icons.plusThin(false)}
                  </div>
                </div>
                <p className="text-white/70 text-xs ml-3 whitespace-nowrap group-hover:text-white transition">
                  Add Class
                </p>
              </div>
            </NavLinkTooltip>
          </div>
          <Divider />*/}
          {/* Button Group */}
          <div className="flex flex-col space-y-2">
            {navLinks.map((link, i) => {
              const toggleExercises = toggleExercisesLinks.includes(link);
              const isActiveLink = activeLink.id === link.id;

              const clickHandler = () => {
                // if link should toggle exercises (view all, lessons, problems)
                if (toggleExercises) {
                  // if link is already active, toggle exercises. if not, show exercises
                  if (isActiveLink) {
                    toggleContentSidebar(!contentSidebarHidden);
                  } else {
                    toggleContentSidebar(false);
                  }
                } else {
                  // if link is not in toggleExercises, close exercises
                  toggleContentSidebar(true);
                }

                setActiveLink(link);

                switch (link.text) {
                  case "View All":
                    setActiveContent("all");
                    break;
                  case "Lessons":
                    setActiveContent("lessons");
                    break;
                  case "Problems":
                    setActiveContent("problems");
                    break;
                  default:
                    break;
                }
              };

              return (
                <NavLink
                  key={i}
                  open={!mainSidebarHidden}
                  icon={link.icon}
                  text={link.text}
                  active={activeLink.id === link.id}
                  onClick={clickHandler}
                />
              );
            })}
          </div>
        </section>
        {/* Bottom Group */}
        <div className="w-full space-y-4">
          <div className="flex flex-col space-y-2">
            {/* Theme Toggle */}
            {mounted ? (
              <NavLinkTooltip text="Toggle Theme" disabled={!mainSidebarHidden}>
                <div
                  className={`w-full h-12 cursor-pointer rounded-md overflow-hidden relative flex items-center justify-between px-[14px] group text-nav-inactive-light hover:bg-emerald-500/5`}
                  onClick={() => {
                    setTheme(currentTheme === "dark" ? "light" : "dark");
                  }}
                >
                  <div className="flex space-x-4" role="button" tabIndex={0}>
                    <div className="w-5 h-5 min-w-[20px] relative">
                      <div
                        className={`absolute top-0 left-0 w-full h-full transition-all ${
                          currentTheme === "dark"
                            ? "right-5 opacity-0 rotate-90"
                            : "opacity-100 rotate-0 right-0"
                        }`}
                      >
                        {icons.sun(false)}
                      </div>
                      <div
                        className={`absolute left-0 top-0 w-full h-full transition-all ${
                          currentTheme === "dark"
                            ? "opacity-100 rotate-0 right-0"
                            : "opacity-0 -rotate-90 -right-5"
                        }`}
                      >
                        {icons.moon(false)}
                      </div>
                    </div>
                    <label
                      className={`text-sm group-hover:text-white pointer-events-none transition text-ellipsis whitespace-nowrap ${
                        !mainSidebarHidden ? "opacity-100" : "opacity-0"
                      }`}
                      htmlFor="dark-mode"
                    >
                      Dark Mode
                    </label>
                  </div>
                  <Switch.Root
                    className="w-[42px] h-[25px] rounded-full relative border border-emerald-500/50 data-[state=checked]:bg-emerald-500 outline-none cursor-default"
                    id="dark-mode"
                    checked={currentTheme === "dark"}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "dark" : "light");
                    }}
                  >
                    <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
                  </Switch.Root>
                </div>
              </NavLinkTooltip>
            ) : (
              <></>
            )}
          </div>
          {/* Settings */}
          <NavLinkTooltip text="Settings" disabled={!mainSidebarHidden}>
            <div role="button" tabIndex={0}
              className={`w-full cursor-pointer h-12 rounded-md overflow-hidden flex items-center justify-start px-[14px] group space-x-4 text-nav-inactive-light hover:bg-emerald-500/5`}
            >
              <div className="w-5 h-5 min-w-[20px]">{icons.cog(false)}</div>
              <div
                className={`text-sm group-hover:text-white transition text-ellipsis whitespace-nowrap ${
                  !mainSidebarHidden ? "opacity-100" : "opacity-0"
                }`}
              >
                Settings
              </div>
            </div>
          </NavLinkTooltip>
          {/* Divider */}
          <Divider />
          {/* Collapse/Expand Button */}
          <NavLinkTooltip text={"Expand"} disabled={!mainSidebarHidden}>
            <div role="button" tabIndex={0}
              onClick={() => toggleMainSidebar(!mainSidebarHidden)}
              className={`w-full cursor-pointer h-12 rounded-md overflow-hidden flex items-center justify-start px-[14px] group space-x-4 text-nav-inactive-light hover:bg-emerald-500/5`}
            >
              <div 
                className={`w-5 h-5 min-w-[20px] transition-transform ${
                  !mainSidebarHidden ? "rotate-180" : ""
                }`}
              >
                {icons.expandArrow(false)}
              </div>
              <div 
                className={`text-sm group-hover:text-white transition text-ellipsis whitespace-nowrap ${
                  !mainSidebarHidden ? "opacity-100" : "opacity-0"
                }`}
              >
                Collapse
              </div>
            </div>
          </NavLinkTooltip>
        </div>
      </div>
    </nav>
  );
};

export default SideNavigation;
