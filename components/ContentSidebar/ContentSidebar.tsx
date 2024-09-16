import useNavigation from "hooks/useNavigation";
import React, { useEffect } from "react";
import { LocalStorage } from "lib/auth/LocalStorage";
import { FetchStatus } from "hooks/types";
import * as Accordion from "@radix-ui/react-accordion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { createNavStructure } from "utils/CodeEditorUtils";
import {
  ILessonItem,
  INavigationItem,
  IProblemItem,
} from "components/CodeEditor/types";
import Link from "next/link";
import { useRouter } from "next/router";
import * as Tabs from "@radix-ui/react-tabs";
import { ContentType } from "components/PlaygroundLayout/PlaygroundLayout";
import { DoubleArrowLeftIcon } from "@radix-ui/react-icons";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { ItemPath, ModulePath } from "./DropDownTree/paths";
import { navLinks } from "components/SideNav/navigationData";
import { AccordionContent } from "utils/radixTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "lib/store/store";
import { setContentSidebarHidden } from "state/interfaceControls.slice";
import { AnimatePresence, motion as m } from "framer-motion";
import AnimateHeight from "react-animate-height";

const ContentSidebar = ({
  activeContent,
  setActiveContent,
  dropdownHeights,
}: {
  activeContent: ContentType;
  setActiveContent: (activeContent: ContentType) => void;
  dropdownHeights: Record<number, number>;
}) => {
  const [openModules, setOpenModules] = React.useState<string[]>([]);

  const { problemAndLessonSet, status } = useNavigation(
    LocalStorage.getToken() !== null
  );

  const { contentSidebarHidden } = useSelector(
    (state: RootState) => state.interfaceControls
  );

  const dispatch = useDispatch();

  const toggleContentSidebar = (hidden: boolean) => {
    dispatch(setContentSidebarHidden(hidden));
  };

  const navigation = createNavStructure(problemAndLessonSet);

  const router = useRouter();
  const { lessonId, problemId } = router.query;

  const activeId = lessonId || problemId || "";

  const toggleExercisesLinks = navLinks.filter((link) => link.toggleExercises);

  return (
    <ScrollArea.Root
      className={`overflow-hidden w-72 min-w-[18rem] h-full bg-nav-dark flex-col  z-40 border-r border-r-slate-700 `}
    >
      <ScrollArea.Viewport className="w-full h-full">
        {/* Header */}
        <div className="w-full h-20 min-h-[5rem] flex items-center px-6 justify-between">
          <h1 className="text-white font-dm font-medium text-lg">Exercises</h1>
          <div role="button" tabIndex={0}
            onClick={() => {
              toggleContentSidebar(!contentSidebarHidden);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/20 transition cursor-pointer"
          >
            <DoubleArrowLeftIcon className="text-slate-300" />
          </div>
        </div>
        <div className="w-full">
          <Tabs.Root
            className="flex flex-col w-full rounded-md"
            value={activeContent}
            onValueChange={(value) => {
              setActiveContent(value as ContentType);
            }}
          >
            <Tabs.List
              className="shrink-0 flex"
              aria-label="Select content type"
            >
              {toggleExercisesLinks.map((link) => (
                <Tabs.Trigger
                  key={link.id}
                  className="px-3 py-3 transition data-[state=active]:border-b data-[state=inactive]:text-white border-b-slate-500 data-[state=active]:border-b-emerald-400 flex-1 flex items-center justify-center text-sm font-dm leading-none text-slate-500 select-none hover:bg-blue-500/10 data-[state=active]:text-white outline-none cursor-default"
                  value={link.id}
                >
                  {link.text}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>
        </div>

        {status === FetchStatus.loading ? (
          <LoadingState />
        ) : status === FetchStatus.failed ? (
          <ErrorState />
        ) : (
          <>
            <Accordion.Root
              onValueChange={(value) => {
                //value is array of open modules
                setOpenModules(value);
              }}
              className="w-full font-dm"
              type="multiple"
            >
              <div className="w-full h-px bg-slate-500"></div>
              {navigation &&
                navigation.map(
                  (value: INavigationItem, primaryIndex: number) => {
                    const filterContent = (
                      contentList: INavigationItem,
                      activeContent: "problems" | "lessons" | "all"
                    ) => {
                      if (activeContent === "problems") {
                        return contentList.problems;
                      } else if (activeContent === "lessons") {
                        return contentList.lessons;
                      } else {
                        return [
                          ...contentList.problems,
                          ...contentList.lessons,
                        ];
                      }
                    };

                    const filteredContent = filterContent(value, activeContent); // Get content based on activeContent parameter
                    const itemCount = filteredContent.length; // number of total problems, lessons or both in a module based on activeContent
                    const isEmpty = itemCount === 0; // if module is empty
                    const allContent = isEmpty ? [] : filteredContent; // all problems and lessons in a module based on activeContent
                    const isActiveModule = allContent.some(
                      (item) => item._id === activeId // if module contains the current active content
                    );

                    return (
                      <Accordion.Item
                        value={value.name}
                        key={primaryIndex}
                        className="border-t border-slate-700 last:border-b group dropdown"
                      >
                        <Accordion.Trigger
                          className={`pl-[0.875rem] relative pr-4 group py-3 w-full flex items-center justify-between overflow-hidden`}
                        >
                          <div className="flex items-center">
                            <AnimatePresence>
                              {!isEmpty ? (
                                <m.div
                                  key={`${value.name}-${primaryIndex}`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute left-7 top-[50%] dash group-data-[state=open]:dashreverse group-data-[state=closed]:dashreverse origin-bottom"
                                >
                                  <ModulePath
                                    moduleOpen={openModules.includes(
                                      value.name
                                    )}
                                  />
                                </m.div>
                              ) : (
                                <></>
                              )}
                            </AnimatePresence>
                            <div
                              className={`w-4 h-4 mx-2 border-2 z-10 border-slate-600 group-data-[state=open]:border-white transition-colors duration-500 bg-nav-dark rounded-full ${
                                isActiveModule ? "!border-emerald-500" : ""
                              }`}
                            ></div>
                            <p className="font-medium text-left text-sm text-white">{`${
                              primaryIndex + 1
                            }. ${value.name}`}</p>
                          </div>
                          <ChevronDownIcon
                            className="text-white ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
                            aria-hidden
                          />
                        </Accordion.Trigger>
                        <AccordionContent className="AccordionContent">
                          <AnimateHeight
                            contentClassName="h-full"
                            height={
                              allContent.length == 0
                                ? 44
                                : dropdownHeights[primaryIndex]
                            }
                            className="flex flex-col"
                          >
                            <AnimatePresence exitBeforeEnter>
                              {isEmpty ? (
                                <m.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className={`relative flex px-8 items-center cursor-pointer justify-center `}
                                >
                                  <p className="text-slate-400 text-sm py-3 w-full line text-center">
                                    No Content here :&#40;
                                  </p>
                                </m.div>
                              ) : (
                                allContent.map(
                                  (
                                    item: IProblemItem | ILessonItem,
                                    secondaryIndex: number
                                  ) => {
                                    const id = item._id;
                                    //check type of item
                                    const type =
                                      "problemName" in item
                                        ? "problem"
                                        : "lesson";
                                    const name =
                                      "problemName" in item
                                        ? item.problemName
                                        : item.lessonName;
                                    const urlPath =
                                      type === "problem" ? "code" : "learn";

                                    return (
                                      <Link href={`/${urlPath}/${id}`} key={id}>
                                        <m.div
                                          initial={{ opacity: 0, x: 10 }}
                                          animate={{
                                            opacity: 1,
                                            x: 0,
                                            transition: {
                                              delay: secondaryIndex * 0.1,
                                            },
                                          }}
                                          exit={{ opacity: 0 }}
                                          key={`${primaryIndex}-${secondaryIndex}`}
                                          className={`relative flex pr-10 pl-8 items-center cursor-pointer justify-start`}
                                        >
                                          <div className="absolute left-7 bottom-[40%]">
                                            <ItemPath
                                              moduleOpen={openModules.includes(
                                                value.name
                                              )}
                                              index={secondaryIndex}
                                            />
                                          </div>
                                          <div
                                            className={`absolute w-[6px] h-[6px] rounded-full top-1/2 -translate-y-1/2 right-5 ${
                                              id === activeId
                                                ? "bg-emerald-500"
                                                : "bg-slate-600"
                                            }`}
                                          ></div>
                                          <div className="w-[2px] min-w-[2px] h-full mr-4 flex flex-col relative"></div>
                                          <p
                                            style={{
                                              //clamp lines to 3
                                              display: "-webkit-box",
                                              WebkitLineClamp: 3,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                            }}
                                            className="text-white text-sm py-3 w-full line"
                                          >
                                            {`${primaryIndex + 1}.${
                                              secondaryIndex + 1
                                            } ${name}`}
                                          </p>
                                        </m.div>
                                      </Link>
                                    );
                                  }
                                )
                              )}
                            </AnimatePresence>
                          </AnimateHeight>
                        </AccordionContent>
                      </Accordion.Item>
                    );
                  }
                )}
            </Accordion.Root>
            <HiddenSizingItems
              navigation={navigation}
              activeContent={activeContent}
            />
          </>
        )}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-slate-600/60 transition duration-[160ms] ease-out hover:bg-white/20 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-slate-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-slate-600/60 transition duration-[160ms] ease-out hover:bg-white/20 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="flex-1 bg-slate-400 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-white/20" />
    </ScrollArea.Root>
  );
};

export const HiddenSizingItems = ({
  navigation,
  activeContent,
}: {
  navigation: INavigationItem[];
  activeContent: "problems" | "lessons" | "all";
}) => {
  return (
    <div className="w-full absolute pointer-events-none -z-10 opacity-0">
      {/* Sizing Elements to animate height (stay hidden) */}
      {navigation &&
        navigation.map((value: INavigationItem, primaryIndex: number) => {
          const filterContent = (
            contentList: INavigationItem,
            activeContent: "problems" | "lessons" | "all"
          ) => {
            if (activeContent === "problems") {
              return contentList.problems;
            } else if (activeContent === "lessons") {
              return contentList.lessons;
            } else {
              return [...contentList.problems, ...contentList.lessons];
            }
          };

          const filteredContent = filterContent(value, activeContent);

          const allContent = [...value.problems, ...value.lessons];

          return allContent.map(
            (item: IProblemItem | ILessonItem, secondaryIndex: number) => {
              const id = item._id;
              const name =
                "problemName" in item ? item.problemName : item.lessonName;
              const type = "problemName" in item ? "problem" : "lesson";

              return (
                <div key={id}>
                  <div
                    className={`relative flex pr-10 pl-8 items-center cursor-pointer justify-start ${primaryIndex}-${type} ${primaryIndex}-content`}
                  >
                    <div className="w-[2px] min-w-[2px] h-full mr-4 flex flex-col relative"></div>
                    <p
                      style={{
                        //clamp lines to 3
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      className="text-white text-sm py-3 w-full line"
                    >
                      {`${primaryIndex + 1}.${secondaryIndex + 1} ${name}`}
                    </p>
                  </div>
                </div>
              );
            }
          );
        })}
    </div>
  );
};

export default ContentSidebar;
