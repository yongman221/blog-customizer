import {
  backgroundColors,
  contentWidthArr,
  defaultArticleState,
  fontColors,
  fontFamilyOptions,
  fontSizeOptions,
  type ArticleStateType,
  type OptionType,
} from '@/constants/articleProps';
import { RadioGroup } from '@/ui/radio-group';
import { Select } from '@/ui/select';
import { Separator } from '@/ui/separator';
import { Text } from '@/ui/text';
import { clsx } from 'clsx';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';

import styles from './ArticleParamsForm.module.scss';

export type TArticleParamsFormProps = {
  onSubmit: Dispatch<SetStateAction<ArticleStateType>>;
  onReset: () => void;
};

export const ArticleParamsForm = ({
  onSubmit,
  onReset,
}: TArticleParamsFormProps): React.JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [draftArticleState, setDraftArticleState] =
    useState<ArticleStateType>(defaultArticleState);

  const formRef = useRef<HTMLFormElement | null>(null);
  const sidebarRootRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (key: keyof ArticleStateType, option: OptionType): void => {
    setDraftArticleState((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  useEffect(() => {
    const form = formRef.current;

    if (!isSidebarOpen) {
      return;
    }

    if (!form) {
      return;
    }

    const handleOutsideMouseDown = (event: MouseEvent): void => {
      if (
        event.target instanceof Node &&
        !sidebarRootRef.current?.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    const handleSubmit = (event: SubmitEvent): void => {
      event.preventDefault();
      onSubmit(draftArticleState);
    };

    const handleReset = (event: Event): void => {
      event.preventDefault();
      setDraftArticleState(defaultArticleState);
      onReset();
    };

    document.addEventListener('mousedown', handleOutsideMouseDown);

    form.addEventListener('submit', handleSubmit);

    form.addEventListener('reset', handleReset);

    return (): void => {
      document.removeEventListener('mousedown', handleOutsideMouseDown);
      form.removeEventListener('submit', handleSubmit);
      form.removeEventListener('reset', handleReset);
    };
  }, [isSidebarOpen, draftArticleState, onSubmit, onReset]);

  return (
    <div ref={sidebarRootRef}>
      <ArrowButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <aside
        className={clsx(styles.container, { [styles.container_open]: isSidebarOpen })}
      >
        <form className={styles.form} ref={formRef}>
          <Text as="h2" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            selected={draftArticleState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={(option) => handleChange('fontFamilyOption', option)}
            title="шрифт"
          />
          <RadioGroup
            name="radio"
            options={fontSizeOptions}
            selected={draftArticleState.fontSizeOption}
            onChange={(option) => handleChange('fontSizeOption', option)}
            title="размер шрифта"
          />
          <Select
            selected={draftArticleState.fontColor}
            options={fontColors}
            onChange={(option) => handleChange('fontColor', option)}
            title="цвет шрифта"
          />
          <Separator />
          <Select
            selected={draftArticleState.backgroundColor}
            options={backgroundColors}
            onChange={(option) => handleChange('backgroundColor', option)}
            title="цвет фона"
          />
          <Select
            selected={draftArticleState.contentWidth}
            options={contentWidthArr}
            onChange={(option) => handleChange('contentWidth', option)}
            title="ширина контента"
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
