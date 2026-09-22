import { useMemo, type ReactNode } from 'react';
import { useGetIdentity } from '@refinedev/core';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Layers,
  Presentation,
  School,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useApiQuery } from '@/hooks/use-api-query';
import type { ActivityItem, DashboardCharts, DashboardOverview } from '@/types';

type Identity = { role?: 'admin' | 'teacher' | 'student' };

const STATUS_COLORS: Record<string, { light: string; dark: string }> = {
  available: { light: '#0ca30c', dark: '#0ca30c' },
  nearFull: { light: '#fab219', dark: '#fab219' },
  full: { light: '#d03b3b', dark: '#d03b3b' },
};
const STATUS_LABELS: Record<string, string> = { available: 'Available', nearFull: 'Nearly Full', full: 'Full' };

const ROLE_COLORS: Record<string, { light: string; dark: string }> = {
  admin: { light: '#2a78d6', dark: '#3987e5' },
  teacher: { light: '#eb6834', dark: '#d95926' },
  student: { light: '#1baf7a', dark: '#199e70' },
};

const ACTIVITY_ICONS: Record<ActivityItem['type'], ReactNode> = {
  enrollment: <ClipboardList className="h-4 w-4" />,
  class_created: <Presentation className="h-4 w-4" />,
  user_created: <UserPlus className="h-4 w-4" />,
};

const StatCard = ({ icon, label, value, loading }: { icon: ReactNode; label: string; value?: string | number; loading: boolean }) => (
  <Card>
    <CardContent className="flex items-center gap-4 py-2">
      <div className="bg-muted rounded-full p-2 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="text-2xl font-semibold">{loading ? '—' : value ?? 0}</p>
      </div>
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  const { data: identity } = useGetIdentity<Identity>();
  const isTeacher = identity?.role === 'teacher';

  const { data: overview, isLoading: overviewLoading } = useApiQuery<DashboardOverview>('dashboard/overview');
  const { data: charts, isLoading: chartsLoading } = useApiQuery<DashboardCharts>('dashboard/charts');
  const { data: activity, isLoading: activityLoading } = useApiQuery<ActivityItem[]>('dashboard/activity');

  const enrollmentConfig: ChartConfig = {
    count: { label: 'Enrollments', theme: { light: '#2a78d6', dark: '#3987e5' } },
  };
  const departmentConfig: ChartConfig = {
    count: { label: 'Classes', theme: { light: '#2a78d6', dark: '#3987e5' } },
  };
  const capacityConfig: ChartConfig = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(STATUS_LABELS).map(([key, label]) => [key, { label, theme: STATUS_COLORS[key] }])
      ),
    []
  );
  const userDistConfig: ChartConfig = useMemo(
    () =>
      Object.fromEntries(
        (charts?.userDistribution ?? []).map((row) => [
          row.role,
          { label: row.role, theme: ROLE_COLORS[row.role] ?? { light: '#898781', dark: '#898781' } },
        ])
      ),
    [charts]
  );

  const studentCount = overview?.usersByRole?.find((r) => r.role === 'student')?.count;
  const teacherCount = overview?.usersByRole?.find((r) => r.role === 'teacher')?.count;
  const adminCount = overview?.usersByRole?.find((r) => r.role === 'admin')?.count;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="page-title">{isTeacher ? 'My Teaching Overview' : 'Organization Overview'}</h1>
        <p className="text-muted-foreground">
          {isTeacher ? 'Your classes, students, and recent activity.' : 'Organization-wide metrics and recent activity.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Presentation className="h-4 w-4" />}
          label={isTeacher ? 'My Classes' : 'Total Classes'}
          value={overview?.totalClasses}
          loading={overviewLoading}
        />
        <StatCard icon={<ClipboardList className="h-4 w-4" />} label="Total Enrollments" value={overview?.totalEnrollments} loading={overviewLoading} />
        <StatCard icon={<Layers className="h-4 w-4" />} label="Departments" value={overview?.totalDepartments} loading={overviewLoading} />
        <StatCard icon={<BookOpen className="h-4 w-4" />} label="Subjects" value={overview?.totalSubjects} loading={overviewLoading} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<GraduationCap className="h-4 w-4" />}
          label="Avg Capacity Utilization"
          value={overview ? `${Math.round(overview.avgCapacityUtilization * 100)}%` : undefined}
          loading={overviewLoading}
        />
        {!isTeacher && (
          <>
            <StatCard icon={<GraduationCap className="h-4 w-4" />} label="Students" value={studentCount} loading={overviewLoading} />
            <StatCard icon={<School className="h-4 w-4" />} label="Teachers" value={teacherCount} loading={overviewLoading} />
            <StatCard icon={<ShieldCheck className="h-4 w-4" />} label="Admins" value={adminCount} loading={overviewLoading} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Enrollments per month, last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={enrollmentConfig} className="h-64 w-full">
              <AreaChart data={charts?.enrollmentTrends ?? []} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  dataKey="count"
                  type="monotone"
                  stroke="var(--color-count)"
                  fill="var(--color-count)"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ r: 4, fill: 'var(--color-count)', stroke: 'var(--background)', strokeWidth: 2 }}
                />
              </AreaChart>
            </ChartContainer>
            {!chartsLoading && !charts?.enrollmentTrends.length && (
              <p className="text-muted-foreground text-sm">No enrollments in this period yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes by Department</CardTitle>
            <CardDescription>Active class count per department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={departmentConfig} className="h-64 w-full">
              <BarChart data={charts?.classesByDepartment ?? []} margin={{ left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="department"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: string) => (v.length > 10 ? `${v.slice(0, 10)}…` : v)}
                />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ChartContainer>
            {!chartsLoading && !charts?.classesByDepartment.length && (
              <p className="text-muted-foreground text-sm">No classes yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Capacity Status</CardTitle>
            <CardDescription>Classes bucketed by how full they are</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={capacityConfig} className="h-64 w-full">
              <BarChart
                data={(charts?.capacityStatus ?? []).map((row) => ({ ...row, label: STATUS_LABELS[row.status] }))}
                layout="vertical"
                margin={{ left: 8 }}
              >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="label" tickLine={false} axisLine={false} width={90} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                  {(charts?.capacityStatus ?? []).map((row) => (
                    <Cell key={row.status} fill={`var(--color-${row.status})`} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isTeacher ? 'Students Reached' : 'User Distribution'}</CardTitle>
            <CardDescription>{isTeacher ? 'Distinct students across your classes' : 'Users by role'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={userDistConfig} className="h-64 w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={charts?.userDistribution ?? []}
                  dataKey="count"
                  nameKey="role"
                  innerRadius={50}
                  outerRadius={80}
                  strokeWidth={2}
                  stroke="var(--background)"
                >
                  {(charts?.userDistribution ?? []).map((row) => (
                    <Cell key={row.role} fill={`var(--color-${row.role})`} />
                  ))}
                </Pie>
                {!isTeacher && <ChartLegend content={<ChartLegendContent />} />}
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {activityLoading && <p className="text-muted-foreground text-sm">Loading...</p>}
          {!activityLoading && !activity?.length && <p className="text-muted-foreground text-sm">No recent activity.</p>}
          {activity?.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 border-b pb-3 last:border-b-0">
              <div className="bg-muted text-muted-foreground rounded-full p-2">{ACTIVITY_ICONS[item.type]}</div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{item.label}</span> {item.detail}
                </p>
                <p className="text-muted-foreground text-xs">{formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
