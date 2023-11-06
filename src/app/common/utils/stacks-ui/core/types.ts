import * as React from 'react';

type ElementTagNameMap = HTMLElementTagNameMap &
  Pick<SVGElementTagNameMap, Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>>;

type ElementByTag<TagName extends keyof ElementTagNameMap> = ElementTagNameMap[TagName] &
  React.HTMLAttributes<ElementTagNameMap[TagName]>;

export type As<BaseProps = any> = React.ElementType<BaseProps>;

type PropsWithAs<ComponentProps, ComponentType extends As> = ComponentProps &
  Omit<React.ComponentPropsWithRef<ComponentType>, 'as' | keyof ComponentProps> & {
    as?: ComponentType;
  };

type PropsFromAs<ComponentProps, ComponentType extends As> = (PropsWithAs<
  ComponentProps,
  ComponentType
> & { as: ComponentType }) &
  PropsWithAs<ComponentProps, ComponentType>;

interface FunctionComponentWithAs<ComponentProps, ComponentType extends As> {
  /**
   * Inherited from React.FunctionComponent with modifications to support `as`
   */
  <TT extends As>(
    props: PropsWithAs<ComponentProps, TT>,
    context?: any
  ): React.ReactElement<any, any> | null;
  (
    props: PropsWithAs<ComponentProps, ComponentType>,
    context?: any
  ): React.ReactElement<any, any> | null;

  /**
   * Inherited from React.FunctionComponent
   */
  displayName?: string;
  propTypes?: React.WeakValidationMap<PropsWithAs<ComponentProps, ComponentType>>;
  contextTypes?: React.ValidationMap<any>;
  defaultProps?: Partial<PropsWithAs<ComponentProps, ComponentType>>;
}

interface ExoticComponentWithAs<ComponentProps, ComponentType extends As> {
  /**
   * **NOTE**: Exotic components are not callable.
   * Inherited from React.ExoticComponent with modifications to support `as`
   */
  <TT extends As>(props: PropsWithAs<ComponentProps, TT>): React.ReactElement | null;
  (props: PropsWithAs<ComponentProps, ComponentType>): React.ReactElement | null;

  /**
   * Inherited from React.ExoticComponent
   */
  readonly $$typeof: symbol;
}

interface NamedExoticComponentWithAs<ComponentProps, ComponentType extends As>
  extends ExoticComponentWithAs<ComponentProps, ComponentType> {
  /**
   * Inherited from React.NamedExoticComponent
   */
  displayName?: string;
}

export interface ForwardRefExoticComponentWithAs<ComponentProps, ComponentType extends As>
  extends NamedExoticComponentWithAs<ComponentProps, ComponentType> {
  /**
   * Inherited from React.ForwardRefExoticComponent
   * Will show `ForwardRef(${Component.displayName || Component.name})` in devtools by default,
   * but can be given its own specific name
   */
  defaultProps?: Partial<PropsWithAs<ComponentProps, ComponentType>>;
  propTypes?: React.WeakValidationMap<PropsWithAs<ComponentProps, ComponentType>>;
}

export interface MemoExoticComponentWithAs<ComponentProps, ComponentType extends As>
  extends NamedExoticComponentWithAs<ComponentProps, ComponentType> {
  readonly type: ComponentType extends React.ComponentType
    ? ComponentType
    : FunctionComponentWithAs<ComponentProps, ComponentType>;
}

export interface ForwardRefWithAsRenderFunction<ComponentProps, ComponentType extends As = 'div'> {
  (
    props: React.PropsWithRef<PropsFromAs<ComponentProps, ComponentType>>,
    ref:
      | ((
          instance:
            | (ComponentType extends keyof ElementTagNameMap ? ElementByTag<ComponentType> : any)
            | null
        ) => void)
      | React.MutableRefObject<
          (ComponentType extends keyof ElementTagNameMap ? ElementByTag<ComponentType> : any) | null
        >
      | React.Ref<
          (ComponentType extends keyof ElementTagNameMap ? ElementByTag<ComponentType> : any) | null
        >
      | any
  ): React.ReactElement | null;
  displayName?: string;
  // explicit rejected with `never` required due to
  // https://github.com/microsoft/TypeScript/issues/36826
  /**
   * defaultProps are not supported on render functions
   */
  defaultProps?: never;
  /**
   * propTypes are not supported on render functions
   */
  propTypes?: never;
}
