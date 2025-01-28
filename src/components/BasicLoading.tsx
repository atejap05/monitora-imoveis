import { LoaderSizeProps } from "react-spinners/helpers/props";

type BasicLoadingProps = {
  label: string;
  loading: boolean;
  Loader: React.FC<LoaderSizeProps>;
  color?: string;
  size?: number;
};

const BasicLoading = ({
  loading,
  label,
  Loader,
  color,
  size,
}: BasicLoadingProps) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 h-96">
      <Loader color={color} size={size} loading={loading} />
      <span className="text-green animate-pulse">{label}</span>
    </div>
  );
};

export default BasicLoading;
