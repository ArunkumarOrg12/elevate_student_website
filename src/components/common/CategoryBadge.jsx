import { getCategoryClass } from '../../utils/helpers';

export default function CategoryBadge({ category, size = 'sm' }) {
  return (
    <span className={getCategoryClass(category)}>
      {category}
    </span>
  );
}
