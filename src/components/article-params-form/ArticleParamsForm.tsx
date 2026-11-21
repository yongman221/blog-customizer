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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [rawStyles, setRawStyles] = useState<ArticleStateType>(defaultArticleState);

  const formRef = useRef<HTMLFormElement | null>(null);

  const handleChange = (key: keyof ArticleStateType, option: OptionType): void => {
    setRawStyles((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  useEffect(() => {
    const form = formRef.current;

    if (!form) {
      return;
    }

    const handleSubmit = (event: SubmitEvent): void => {
      event.preventDefault();
      onSubmit(rawStyles);
    };

    const handleReset = (event: Event): void => {
      event.preventDefault();
      setRawStyles(defaultArticleState);
      onReset();
    };

    form.addEventListener('submit', (event) => {
      handleSubmit(event);
    });

    form.addEventListener('reset', (event) => {
      handleReset(event);
    });

    return (): void => {
      form.removeEventListener('submit', handleSubmit);
      form.removeEventListener('reset', handleReset);
    };
  }, [rawStyles, onSubmit, onReset]);

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} ref={formRef}>
          <Select
            selected={rawStyles.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={(option) => handleChange('fontFamilyOption', option)}
            title="шрифт"
          />
          <RadioGroup
            name="font-size"
            options={fontSizeOptions}
            selected={rawStyles.fontSizeOption}
            onChange={(option) => handleChange('fontSizeOption', option)}
            title="размер шрифта"
          />
          <Select
            selected={rawStyles.fontColor}
            options={fontColors}
            onChange={(option) => handleChange('fontColor', option)}
            title="цвет шрифта"
          />
          <Separator />
          <Select
            selected={rawStyles.backgroundColor}
            options={backgroundColors}
            onChange={(option) => handleChange('backgroundColor', option)}
            title="цвет фона"
          />
          <Select
            selected={rawStyles.contentWidth}
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
    </>
  );
};
