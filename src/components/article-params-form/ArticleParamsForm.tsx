import { defaultArticleState, type ArticleStateType } from '@/constants/articleProps';
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

    formRef.current?.addEventListener('submit', (event) => {
      handleSubmit(event);
    });

    formRef.current?.addEventListener('reset', (event) => {
      handleReset(event);
    });

    return (): void => {
      formRef.current?.removeEventListener('submit', handleSubmit);
      formRef.current?.removeEventListener('reset', handleReset);
    };
  }, [rawStyles, onSubmit, onReset]);

  return (
    <>
      <ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <aside className={clsx(styles.container, { [styles.container_open]: isOpen })}>
        <form className={styles.form} ref={formRef}>
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </>
  );
};
