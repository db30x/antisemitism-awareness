import { NextResponse } from 'next/server';
import type { Statistics } from '@/lib/types';

// This would typically come from a database
const mockStatistics: Statistics = {
  totalIncidents: 2717,
  onlineHarassment: 63,
  physicalAssaults: 88,
  yearOverYearChange: {
    totalIncidents: 34,
    onlineHarassment: 12,
    physicalAssaults: 167,
  },
};

export async function GET() {
  return NextResponse.json(mockStatistics);
} 