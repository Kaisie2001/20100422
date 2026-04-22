import React, { useMemo, useState } from 'react';
import {
  Bell,
  Settings,
  Plus,
  Search,
  ChevronDown,
  Import,
  Copy,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects } from '../lib/userProjects';

interface ProjectCardProps {
  title: string;
  location: string;
  description?: string;
  status: string;
  claimState: string;
  claimStateColor: string;
  completeness: number;
  image?: string;
  type?: string;
  evidence?: string;
  isDemo?: boolean;
  badge?: string;
  badgeColor?: string;
  onOpen?: () => void;
}

const StatCard = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  <div
    className={`bg-white p-6 rounded-xl border-l-4 ${color} shadow-sm flex flex-col justify-between h-32`}
  >
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
      {label}
    </span>
    <span className="text-4xl font-bold text-gray-900">{value}</span>
  </div>
);

const ProjectCard = ({
  title,
  location,
  description,
  status,
  claimState,
  claimStateColor,
  completeness,
  image,
  type,
  evidence,
  isDemo,
  badge,
  badgeColor,
  onOpen,
}: ProjectCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full cursor-pointer"
    onClick={() => {
      if (onOpen) onOpen();
    }}
  >
    {image && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {isDemo && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight text-gray-900">
            Demo Case
          </div>
        )}
      </div>
    )}

    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1 mr-4">
          {title}
        </h3>
        {badge && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${badgeColor}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center text-gray-500 text-sm mb-4">
        <MapPin size={14} className="mr-1" />
        {location}
      </div>

      {description && (
        <p className="text-gray-500 text-xs italic mb-6">{description}</p>
      )}

      <div className="mt-auto space-y-4">
        <div className="flex justify-between text-xs">
          <div className="flex flex-col">
            <span className="text-gray-400 uppercase font-medium mb-1">
              Status
            </span>
            <span className="font-semibold text-gray-900">{status}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 uppercase font-medium mb-1">
              Claim State
            </span>
            <span
              className={`font-semibold px-2 py-0.5 rounded ${claimStateColor}`}
            >
              {claimState}
            </span>
          </div>
        </div>

        {type && evidence && (
          <div className="flex justify-between text-xs pt-2 border-t border-gray-50">
            <div className="flex flex-col">
              <span className="text-gray-400 uppercase font-medium mb-1">
                Type
              </span>
              <span className="font-semibold text-gray-900">{type}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400 uppercase font-medium mb-1">
                Evidence
              </span>
              <span className="font-semibold text-gray-900">{evidence}</span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-gray-900">Completeness</span>
            <span className="text-blue-600">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-blue-900 h-full rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const userProjects = useMemo(() => getUserProjects(), []);
  const claimReadyCount = useMemo(
    () => userProjects.filter((project) => project.claimState === 'Ready').length,
    [userProjects]
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900">
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* Title Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">Projects</h1>
          <p className="text-gray-500 text-lg">
            Browse demo cases and user-created workspaces.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <button
            className="bg-blue-900 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md active:scale-95"
            onClick={() => navigate('/projects/new')}
          >
            <Plus size={20} />
            New Project
          </button>
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <Import size={20} />
            Import Project
          </button>
          <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
            <Copy size={20} />
            Duplicate Case
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard label="Total Projects" value={String(3 + userProjects.length)} color="border-blue-900" />
          <StatCard label="Demo Cases" value="3" color="border-gray-400" />
          <StatCard label="User Projects" value={String(userProjects.length)} color="border-blue-400" />
          <StatCard label="Claim-Ready" value={String(1 + claimReadyCount)} color="border-green-500" />
          <StatCard label="In Setup" value={String(Math.max(0, userProjects.length - claimReadyCount))} color="border-orange-400" />
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-4 mb-12">
          <div className="flex-1 min-w-[300px] relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search projects, locations, or types..."
              className="w-full pl-12 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-900/20 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: 'Source', value: 'All' },
              { label: 'Project Type', value: 'All' },
              { label: 'Status', value: 'All' },
              { label: 'Evidence', value: 'All' },
            ].map((filter) => (
              <button
                key={filter.label}
                className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-500">{filter.label}:</span>
                <span className="text-gray-900">{filter.value}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Demo Cases Section */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-blue-900" size={24} />
            <h2 className="text-2xl font-bold tracking-tight">Demo Cases</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProjectCard
              isDemo
              title="Central Tower - Level 18 Tenant Reinstatement"
              location="Central, HK"
              description="Tenant Reinstatement Fit-out"
              status="Baseline Conventional"
              claimState="Module D Locked"
              claimStateColor="bg-red-100 text-red-700"
              completeness={82}
              image="https://picsum.photos/seed/central/800/600"
              onOpen={() => navigate('/projects/central/overview')}
            />

            <ProjectCard
              isDemo
              title="Harbour Business Centre - Low-Carbon Fit-out Upgrade"
              location="Wan Chai, HK"
              description="ESG-led Fit-out Upgrade"
              status="Design Option Study"
              claimState="Screening Only"
              claimStateColor="bg-gray-100 text-gray-700"
              completeness={68}
              image="https://picsum.photos/seed/harbour/800/600"
              onOpen={() => navigate('/projects/harbour/overview')}
            />

            <ProjectCard
              isDemo
              title="Kowloon Bay Flex Office - Decommissioning Pilot"
              location="Kowloon Bay, HK"
              description="Decommissioning Pilot"
              status="Decommissioning Pilot"
              claimState="Partial Unlock"
              claimStateColor="bg-green-100 text-green-700"
              completeness={91}
              image="https://picsum.photos/seed/kowloon/800/600"
              onOpen={() => navigate('/projects/kowloon/overview')}
            />
          </div>
        </section>

      </main>
    </div>
  );
}