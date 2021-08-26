import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  CommandBar,
  ICommandBarItemProps,
  Facepile,
} from "@fluentui/react";
import { People } from '@microsoft/mgt-react';
import { FrsMember } from "@fluid-experimental/frs-client";
import { BrainstormModel } from "../BrainstormModel";
import { DefaultColor } from "./Color";
import { ColorPicker } from "./ColorPicker";
import { NoteData, User } from "../Types";
import { NOTE_SIZE } from "./Note.style";

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export interface HeaderProps {
  model: BrainstormModel;
  author: User;
  members: User[];
}

export function Header(props: HeaderProps) {
  const colorButtonRef = useRef<any>();
  const [color, setColor] = useState(DefaultColor);
  const personas = React.useMemo(() => props.members.map(member => {return { personaName: member.userName}}), [props.members]);
  const { model } = props;
  const [signedInUserIds, setSignedInUserIds ] = useState<string[]>([]);

  // This runs when via model changes whether initiated by user or from external
  useEffect(() => {
    function signedInUserIdsChanged(changed: any, local: any) {
      if (changed.key === "userIds") {
        setSignedInUserIds(model.SignedInUserIds);
      }
    }

    model.setChangeListener(signedInUserIdsChanged);

    return () => model.removeChangeListener(signedInUserIdsChanged);
  }, [model]);

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
      onRender: () => {
        return (
          // <Facepile styles={{ root: { alignSelf: "center" } }}
          //    personas={personas} />
          <div>
              <People userIds={signedInUserIds} showPresence />
          </div>
        );
      },
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
