import { createInfiniteHitsSessionStorageCache } from 'instantsearch.js/es/lib/infiniteHitsCache';
import algoliasearch from 'algoliasearch/lite';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import Timetable from "@/components/Timetable/Timetable";
import useUserTimetable from '@/hooks/contexts/useUserTimetable';
import { useLocalStorage } from 'usehooks-ts';
import { createTimetableFromCourses } from '@/helpers/timetable';
import { MinimalCourse } from '@/types/courses';
import { renderTimetableSlot } from '@/helpers/timetable_course';
import { ScrollArea } from "@/components/ui/scroll-area"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { SearchIcon } from "lucide-react";
import { SearchBox } from 'react-instantsearch';

const searchClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!, process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!);
const sessionStorageCache = createInfiniteHitsSessionStorageCache();

import SearchContainer from './SearchContainer';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import type { SearchBoxProps } from 'react-instantsearch';

const CourseSearchContainer = () => {

  const { getSemesterCourses, semester, setSemester, colorMap } = useUserTimetable();
  const [vertical, setVertical] = useLocalStorage('timetable_vertical', true);
  const timetableData = createTimetableFromCourses(getSemesterCourses(semester) as MinimalCourse[], colorMap);

  return <InstantSearchNext
    searchClient={searchClient}
    indexName="nthu_courses"
    routing
  >
    <div className="flex flex-col h-screen p-8 gap-8">

      <div className="">
        <div className="bg-muted rounded-2xl flex items-center gap-4 p-4">
          <HoverCard>
            <HoverCardTrigger>
              <SearchIcon size="16" />
            </HoverCardTrigger>
            <HoverCardContent align="start" className="whitespace-pre-wrap">
              You can search by <br />
              - Course Name <br />
              - Teacher Name <br />
              - Course ID
            </HoverCardContent>
          </HoverCard>
          <SearchBox
            ignoreCompositionEvents
            placeholder="Search for your course..."
            autoFocus
            classNames={{
              root: 'flex w-full',
              input: 'bg-transparent outline-none w-full',
              form: 'w-full',
              submit: 'hidden',
              reset: 'hidden',
              loadingIndicator: 'hidden',
            }}
          />
          <Separator orientation="vertical" className="px-4" />
        </div>
      </div>

      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        <ResizablePanel className="flex gap-4">
          <SearchContainer
            searchClient={searchClient} 
            sessionStorageCache={sessionStorageCache}
          />
        </ResizablePanel>
        
        <ResizableHandle className="outline-none self-center px-[2px] h-48 mx-4 my-8 rounded-full bg-muted" />
        
        <ResizablePanel collapsible={true} collapsedSize={0} minSize={30} defaultSize={0}>
          <ScrollArea className="w-full h-full overflow-auto">
            <Timetable timetableData={timetableData} vertical={vertical} renderTimetableSlot={renderTimetableSlot} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      
    </div>
  </InstantSearchNext>
};

export default CourseSearchContainer;