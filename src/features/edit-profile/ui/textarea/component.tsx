import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { Path, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";

import cx from "classnames";

import { FormInterface } from "../../lib";

import styles from "./textarea.module.scss";

export function Textarea({
  label,
  register,
  maxLength,
  pattern,
  required,
  setValue,
  watch,
  minLength,
  title,
}: {
  label: Path<FormInterface>;
  register: UseFormRegister<FormInterface>;
  maxLength: number;
  pattern?: RegExp;
  required?: boolean;
  setValue?: UseFormSetValue<FormInterface>;
  watch: UseFormWatch<FormInterface>;
  minLength?: number;
  title: string;
}) {
  const [focus, setFocus] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { ref, ...rest } = register(label, {
    maxLength,
    pattern,
    required,
    minLength,
    onChange: (e) => {
      if (setValue && !e.target.value.match(pattern)) {
        const cur = watch(label) as string;
        setValue(label, cur.slice(0, cur.length - 1));
      } else {
        if (textareaRef.current) {
          textareaRef.current.style.height = `54px`;
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }
    },
    onBlur: () => {
      setFocus(false);
    },
  });
  useImperativeHandle(ref, () => textareaRef.current);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = `54px`;
    }
  }, []);
  return (
    <div
      className={cx(styles.wrapper, {
        [styles.active]: focus,
      })}
    >
      <label
        htmlFor={label}
        className={cx(styles.label, {
          [styles.top]: focus || watch(label),
          [styles.center]: !focus && !watch(label),
        })}
      >
        {title}
      </label>
      <textarea
        ref={textareaRef}
        id={label}
        maxLength={maxLength}
        className={styles.textarea}
        autoComplete="off"
        onFocus={() => setFocus(true)}
        {...rest}
      ></textarea>
      <span className={styles.count}>
        {maxLength - (watch(label) ? watch(label).toString().length : 0)}
      </span>
    </div>
  );
}
