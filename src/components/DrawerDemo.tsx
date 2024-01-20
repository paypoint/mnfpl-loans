import * as React from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type DrawerProps = {
  content: React.ReactNode;
  open: boolean;
};

export function DrawerDemo({ content, open }: DrawerProps) {
  return (
    <Drawer
      onOpenChange={(open) => {
        console.log("Modal is open: ", open);
      }}
      open={open}
      shouldScaleBackground
    >
      {/* <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger> */}
      <DrawerContent>
        <div className="mx-auto h-[90vh] overflow-auto w-full">
          {content}
          {/* <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
