import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import { STUDENT_URLS } from "../constants/apiUrlConstant";
import { useAuth } from "../context/AuthContext";

const useStudentId = () => {
  const { user } = useAuth();
  return user?.id;
};

export const useStudentProfile = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-profile", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_STUDENT_PROFILE(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentTimeline = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-timeline", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_TIMELINE(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentTopicMastery = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-topic-mastery", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_TOPIC_MASTERY(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentAssessmentHistory = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-assessment-history", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_ASSESSMENT_HISTORY(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentBehaviorRadar = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-behavior-radar", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_BEHAVIOR_RADAR(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentPeerBenchmark = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-peer-benchmark", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_PEER_BENCHMARK(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentSkillHeatmap = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-skill-heatmap", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_SKILL_HEATMAP(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentStrengthWeakness = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-strength-weakness", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_STRENGTH_WEAKNESS(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentComparison = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-comparison", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_COMPARISON(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentPlacements = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-placements", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_PLACEMENTS(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentRecommendations = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-recommendations", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_RECOMMENDATIONS(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useStudentImprovementPlan = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-improvement-plan", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_IMPROVEMENT_PLAN(id));
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateImprovementPlan = () => {
  const id = useStudentId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ actionId, status }) =>
      api.patch(STUDENT_URLS.UPDATE_IMPROVEMENT_PLAN(id, actionId), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-improvement-plan", id] });
    },
  });
};

export const useStudentMilestones = () => {
  const id = useStudentId();
  return useQuery({
    queryKey: ["student-milestones", id],
    queryFn: async () => {
      const res = await api.get(STUDENT_URLS.GET_MILESTONES(id));
      return res.data;
    },
    enabled: !!id,
  });
};
