import { defaultArticleState } from '@/constants/articleProps.ts';
import { clsx } from 'clsx';
import { useState, type CSSProperties } from 'react';

import { ArticleParamsForm } from '@components/article-params-form';

import { Article } from '../article/Article';

import type { ArticleStateType } from '@/constants/articleProps.ts';

import styles from './app.module.scss';

export const App = (): React.JSX.Element => {
  const [articleStyles, setArticleStyles] =
    useState<ArticleStateType>(defaultArticleState);

  return (
    <main
      className={clsx(styles.main)}
      style={
        {
          '--font-family': articleStyles.fontFamilyOption.value,
          '--font-size': articleStyles.fontSizeOption.value,
          '--font-color': articleStyles.fontColor.value,
          '--container-width': articleStyles.contentWidth.value,
          '--bg-color': articleStyles.backgroundColor.value,
        } as CSSProperties
      }
    >
      <ArticleParamsForm
        onSubmit={setArticleStyles}
        onReset={() => {
          setArticleStyles(defaultArticleState);
        }}
      />
      <Article />
    </main>
  );
};
