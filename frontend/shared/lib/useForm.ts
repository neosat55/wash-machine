import { useMap } from "usehooks-ts";
import { useEffect, useState } from "react";

export const useForm = <T = object>(data?: T) => {
  const [form, formActions] = useMap<keyof T, any>();

  const [touched, setTouched] = useState<Record<keyof T, any>>(
    // @ts-ignore
    {},
  );

  useEffect(() => {
    formActions.setAll(Object.entries(data || {}) as any);
  }, [data]);

  const setValue = (k: keyof T) => (v: any) => {
    formActions.set(k, v);
    touched[k] = true;
  };

  const getValue = (k: keyof T) => {
    return form.get(k);
  };

  return {
    getValue,
    setValue,
    values: Object.fromEntries(form.entries()),
    isTouched: Object.keys(touched).length > 0,
  };
};
