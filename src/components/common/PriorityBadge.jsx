import { getPriorityClass } from '../../utils/helpers';

export default function PriorityBadge({ priority }) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getPriorityClass(priority)}`}>
      {priority} Priority
    </span>
  );
}
