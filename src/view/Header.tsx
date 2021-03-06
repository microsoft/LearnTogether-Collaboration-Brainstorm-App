import {
  CommandBar,
  ICommandBarItemProps,
  Facepile,
} from "@fluentui/react";
import { AzureMember } from "@fluidframework/azure-client";
import React from "react";
import { BrainstormModel } from "../BrainstormModel";
import { DefaultColor } from "./Color";
import { ColorPicker } from "./ColorPicker";
import { NoteData } from "../Types";
import { NOTE_SIZE } from "./Note.style";
import { uuidv4 } from '../Utils';

export interface HeaderProps {
  model: BrainstormModel;
  author: AzureMember;
  members: AzureMember[];
}

export function Header(props: HeaderProps) {
  const colorButtonRef = React.useRef<any>();
  const [color, setColor] = React.useState(DefaultColor);
  const personas = React.useMemo(() => props.members.map(member => {return { personaName: member.userName}}), [props.members]);

  const onAddNote = () => {
    const { scrollHeight, scrollWidth } = document.getElementById("NoteSpace")!;
    const id = uuidv4();
    const newCardData: NoteData = {
      id,
      position: {
        x: Math.floor(Math.random() * (scrollWidth - NOTE_SIZE.width)),
        y: Math.floor(Math.random() * (scrollHeight - NOTE_SIZE.height)),
      },
      author: props.author,
      numLikesCalculated: 0,
      didILikeThisCalculated: false,
      color
    };
    props.model.SetNote(id, newCardData);
  };

  const items: ICommandBarItemProps[] = [
    {
      key: "add",
      text: "Add note",
      onClick: onAddNote,
      iconProps: {
        iconName: "QuickNote",
      },
    },
    {
      componentRef: colorButtonRef,
      key: "color",
      text: "Default Color",
      iconProps: {
        iconName: "Color",
      },
      subMenuProps: {
        key: "color-picker",
        items: [{ key: "foo" }],
        onRenderMenuList: () => (
          <ColorPicker
            parent={colorButtonRef}
            selectedColor={color}
            setColor={setColor}
          />
        ),
      },
    },
  ];

  const farItems: ICommandBarItemProps[] = [
    {
      key: "presence",
      onRender: () => <Facepile
      styles={{ root: { alignSelf: "center" } }}
      personas={personas}
    />,
    },
  ];
  return (
    <CommandBar
      styles={{ root: { paddingLeft: 0 } }}
      items={items}
      farItems={farItems}
    />
  );
}
