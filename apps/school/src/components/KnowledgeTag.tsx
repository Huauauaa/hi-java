import { Tag } from 'antd';
import type { FC } from 'react';
import { tagSiteUrl } from '../data/siteLinks';

type Props = {
  tag: string;
  chapterId: string;
  className?: string;
};

export const KnowledgeTag: FC<Props> = ({ tag, chapterId, className }) => (
  <a href={tagSiteUrl(tag, chapterId)} target="_blank" rel="noreferrer">
    <Tag
      className={`cursor-pointer transition hover:!border-[#ffa116] hover:!text-[#ffa116] ${className ?? ''}`}
    >
      {tag}
    </Tag>
  </a>
);
