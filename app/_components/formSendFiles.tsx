'use client';

import { Button, Form, Input, Tooltip } from "@heroui/react";
import { PlusIcon } from "./plusIcon";
import { ChangeEvent, Dispatch, SetStateAction, useCallback } from "react";
import FileItem from "./fileItem";
import { GrAttachment } from "react-icons/gr";

export default function FormSendFiles({
  files,
  setFiles,
}: {
  files: File[],
  setFiles: Dispatch<SetStateAction<File[]>>,
}) {
  const gettingAttachments = (e: ChangeEvent<HTMLInputElement>) => {
    let fileList: File[] = [];
    
    if (e.target.files && e.target.files?.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        fileList.push(e.target.files[i]);
      }

      setFiles(fileList);
    }
  }

  const removingAttachment = (filename: string) => {
    let fileIndex = 0;

    let newFileList: File[] = [];
    
    if (files.length > 0) {
      fileIndex = files.findIndex((file) => file.name == filename);

      newFileList = files.filter((file, index) => index != fileIndex);

      setFiles(newFileList);
    }
  }

  const filesComponent = useCallback(() => {
    let fileItems: JSX.Element[] = [];

    if (files.length > 0) {
      files.forEach((file) => {
        let element: JSX.Element = <></>

        element = <FileItem file={file} key={file.name} removeFileFn={() => removingAttachment(file.name)} />

        fileItems.push(element);
      });
    }

    return fileItems;
  }, [ files ]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-4">
        <label htmlFor="inputFile" className="flex items-center gap-2 cursor-pointer">
          <Tooltip content="Inserir anexos">
            <GrAttachment />
          </Tooltip>
        </label>
        <Input
          className="hidden"
          type="file"
          id="inputFile"
          multiple
          accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
          onChange={(e) => gettingAttachments(e)}
        />
      </div>
      {files && (
        <div className="flex flex-wrap gap-2">
          {filesComponent()}
        </div>
      )}
    </div>
  );
}
