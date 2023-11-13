// The AIConsole Project
//
// Copyright 2023 10Clouds
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { cn } from '@/common/cn';
import { getBaseURL } from '@/common/useAPIStore';
import { Agent, Asset, AssetType } from '@/project/editables/chat/assetTypes';
import { getEditableObjectColor } from '@/project/editables/getEditableObjectColor';
import { getEditableObjectIcon } from '@/project/editables/getEditableObjectIcon';
import { useEditableObjectContextMenu } from '@/project/editables/useEditableObjectContextMenu';
import { useProjectContextMenu } from '@/projects/useProjectContextMenu';
import { useProjectsStore } from '@/projects/useProjectsStore';
import { Tooltip } from '@mantine/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { useEditablesStore } from '../../store/useEditablesStore';

function EmptyChatAgentAvatar({ agent }: { agent: Agent }) {
  const { showContextMenu } = useEditableObjectContextMenu({ editableObjectType: 'agent', editableObject: agent });

  return (
    <Tooltip label={`${agent.name}`} position="bottom" transitionProps={{ transition: 'slide-down', duration: 100 }} withArrow >
      <div key={agent.id} className="flex flex-col items-center justify-center">
        <Link
          to={`/agents/${agent.id}`}
          className="inline-block hover:text-secondary"
          onContextMenu={showContextMenu()}
        >
          <img
            src={`${getBaseURL()}/profile/${agent.id}.jpg`}
            className={cn("filter opacity-75 shadows-lg w-20 h-20 mx-auto rounded-full", agent.status === 'forced' && " border-2 border-primary")}
            alt="Logo"
          />
        </Link>
      </div>
    </Tooltip>
  );
}

function EmptyChatAssetLink({ assetType, asset }: { assetType: AssetType; asset: Asset }) {
  const { showContextMenu } = useEditableObjectContextMenu({ editableObjectType: assetType, editableObject: asset });

  const Icon = getEditableObjectIcon(asset);
  const color = getEditableObjectColor(asset);

  return (
    <Link to={`/${assetType}s/${asset.id}`} className="inline-block" onContextMenu={showContextMenu()}>
      <div className={cn("hover:text-secondary flex flex-row items-center gap-1 opacity-80 hover:opacity-100", asset.status === 'forced' && "text-primary")}>
        <Icon style={{ color }} className="w-4 h-4 inline-block mr-1" />
        {asset.name}
      </div>
    </Link>
  );
}

export const EmptyChat = () => {
  const projectName = useProjectsStore((state) => state.projectName);
  const agents = useEditablesStore((state) => state.agents);
  const materials = useEditablesStore((state) => state.materials || []);
  const { showContextMenu: showProjectContextMenu } = useProjectContextMenu();

  return (
    <section className="flex flex-col items-center justify-center container mx-auto px-6 py-8">
      <h2 className="text-4xl mb-8 text-center font-extrabold mt-20 cursor-pointer" onContextMenu={showProjectContextMenu()} onClick={showProjectContextMenu()}>
        <p className="p-2">Project</p>
        <span className=" text-primary uppercase">{projectName}</span>
      </h2>
      <div className="font-bold mb-4 text-center opacity-50 text-sm uppercase">Enabled Agents</div>
      <div className="flex flex-row gap-2 mb-8">
        {agents
          .filter((a) => a.id !== 'user' && a.status !== 'disabled')
          .map((agent) => (
            <EmptyChatAgentAvatar key={agent.id} agent={agent} />
          ))}
      </div>
      <div className="font-bold mb-4 text-center opacity-50 text-sm uppercase">Enabled Materials</div>
      <div className="text-center">
        {materials
          .filter((m) => m.status !== 'disabled')
          .map((material, index, arr) => (
            <React.Fragment key={material.id}>
              <EmptyChatAssetLink assetType="material" asset={material} />
              {index < arr.length - 1 && <span className="opacity-50">, </span>}
            </React.Fragment>
          ))}
      </div>
    </section>
  );
};
