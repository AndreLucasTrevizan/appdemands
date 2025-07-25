'use client';

import { Image, Tooltip } from "@heroui/react";
import DeleteIcon from "./deleteIcon";

export default function FileItem({
  file,
  removeFileFn
}: {
  file: File,
  removeFileFn: (fileName: string) => void;
}) {
  const extArray = file.name.split('.');

  const ext = extArray.pop();

  return (
    <div className="flex items-center border rounded">
      <div
        className="flex items-center gap-2 p-2"
      >
        <Image src={`/svgs/${ext}.svg`} width={20} height={20} alt={file.name} />
        <small>{file.name}</small>
      </div>
      <Tooltip color="danger" content="Remover anexo" >
        <span onClick={() => removeFileFn(file.name)} className="text-lg text-danger cursor-pointer active:opacity-50 p-2">
          <DeleteIcon />
        </span>
      </Tooltip>
    </div>
  );
}