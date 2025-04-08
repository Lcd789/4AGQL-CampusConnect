import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/UI/StatCard";
import ChartCard from "../../components/UI/ChartCard";
import DataTable from "../../components/UI/DataTable";
import {
    Users,
    GraduationCap,
    BookOpen,
    CheckCircle,
    MoreVertical,
    ExternalLink,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";

const Dashboard: React.FC = () => {
    // Données d'exemple pour les stats
    const statCards = [
        {
            title: "Étudiants Total",
            value: "3,456",
            icon: <Users className="h-6 w-6 text-white" />,
            trend: { value: 12, isPositive: true },
            color: "blue",
        },
        {
            title: "Professeurs",
            value: "123",
            icon: <GraduationCap className="h-6 w-6 text-white" />,
            trend: { value: 5, isPositive: true },
            color: "green",
        },
        {
            title: "Classes",
            value: "64",
            icon: <BookOpen className="h-6 w-6 text-white" />,
            trend: { value: 3, isPositive: true },
            color: "purple",
        },
        {
            title: "Taux de réussite",
            value: "87%",
            icon: <CheckCircle className="h-6 w-6 text-white" />,
            trend: { value: 2, isPositive: true },
            color: "orange",
        },
    ];

    // Données pour le graphique d'évolution
    const attendanceData = [
        { name: "Jan", students: 85, classes: 92 },
        { name: "Fév", students: 83, classes: 90 },
        { name: "Mar", students: 88, classes: 93 },
        { name: "Avr", students: 90, classes: 95 },
        { name: "Mai", students: 87, classes: 91 },
        { name: "Juin", students: 89, classes: 94 },
    ];

    // Données pour le graphique de performances
    const performanceData = [
        { name: "Math", score: 78 },
        { name: "Physique", score: 65 },
        { name: "Chimie", score: 82 },
        { name: "Littérature", score: 90 },
        { name: "Histoire", score: 85 },
        { name: "Informatique", score: 92 },
    ];

    // Données pour le tableau des étudiants récents
    const recentStudents = [
        {
            id: 1,
            name: "Sophie Martin",
            email: "sophie.martin@example.com",
            class: "Science 3A",
            attendance: "92%",
            performance: "A",
        },
        {
            id: 2,
            name: "Lucas Dubois",
            email: "lucas.dubois@example.com",
            class: "Math 2B",
            attendance: "88%",
            performance: "B+",
        },
        {
            id: 3,
            name: "Emma Petit",
            email: "emma.petit@example.com",
            class: "Littérature 4C",
            attendance: "95%",
            performance: "A+",
        },
        {
            id: 4,
            name: "Thomas Leroy",
            email: "thomas.leroy@example.com",
            class: "Histoire 1A",
            attendance: "80%",
            performance: "B",
        },
        {
            id: 5,
            name: "Camille Moreau",
            email: "camille.moreau@example.com",
            class: "Physique 3B",
            attendance: "85%",
            performance: "B+",
        },
    ];

    const studentsColumns = [
        { header: "ID", accessor: "id" },
        {
            header: "Nom",
            accessor: "name",
            cell: (value: string) => (
                <div className="font-medium text-white">{value}</div>
            ),
        },
        { header: "Email", accessor: "email" },
        { header: "Classe", accessor: "class" },
        {
            header: "Présence",
            accessor: "attendance",
            cell: (value: string) => (
                <div className="text-green-400 font-medium">{value}</div>
            ),
        },
        {
            header: "Performance",
            accessor: "performance",
            cell: (value: string) => {
                let color = "text-gray-400";
                if (value.includes("A")) color = "text-green-400";
                else if (value.includes("B")) color = "text-blue-400";
                else if (value.includes("C")) color = "text-yellow-400";
                else if (value.includes("D")) color = "text-orange-400";
                else if (value.includes("F")) color = "text-red-400";

                return <div className={`font-medium ${color}`}>{value}</div>;
            },
        },
    ];

    interface StudentRow {
        name: string;
        email: string;
        // Add other properties as needed
    }

    const studentActions = (row: StudentRow) => (
        <div className="flex space-x-2">
            <p>Nom : {row.name}</p>
            <p>Email : {row.email}</p>
            <button className="text-blue-400 hover:text-blue-300">
                <ExternalLink className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
            </button>
        </div>
    );

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Tableau de bord
                </h1>
                <p className="text-gray-400 mt-1">
                    Bienvenue sur la plateforme EduAdmin
                </p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <StatCard
                        key={index}
                        title={card.title}
                        value={card.value}
                        icon={card.icon}
                        trend={card.trend}
                        color={
                            card.color as
                                | "blue"
                                | "green"
                                | "purple"
                                | "orange"
                                | "red"
                        }
                    />
                ))}
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ChartCard
                    title="Évolution de la présence"
                    actions={
                        <select className="bg-gray-700 text-white text-sm rounded-md border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <option>Cette année</option>
                            <option>Année précédente</option>
                        </select>
                    }
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={attendanceData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                            />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    borderColor: "#374151",
                                    borderRadius: "0.375rem",
                                }}
                                labelStyle={{ color: "#F9FAFB" }}
                                itemStyle={{ color: "#F9FAFB" }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                activeDot={{ r: 8 }}
                                name="Étudiants %"
                            />
                            <Line
                                type="monotone"
                                dataKey="classes"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Classes %"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Performance par matière">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={performanceData}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                            />
                            <XAxis dataKey="name" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    borderColor: "#374151",
                                    borderRadius: "0.375rem",
                                }}
                                labelStyle={{ color: "#F9FAFB" }}
                                itemStyle={{ color: "#F9FAFB" }}
                            />
                            <Bar
                                dataKey="score"
                                fill="#8B5CF6"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>
            </div>

            {/* Tableau des étudiants récents */}
            <ChartCard
                title="Étudiants récents"
                actions={
                    <button className="text-blue-400 hover:text-blue-300 text-sm">
                        Voir tout
                    </button>
                }
            >
                <DataTable
                    columns={studentsColumns}
                    data={recentStudents}
                    actions={studentActions}
                />
            </ChartCard>
        </MainLayout>
    );
};

export default Dashboard;
