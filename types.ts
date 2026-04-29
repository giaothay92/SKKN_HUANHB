export interface ReportData {
  title: string;
  focus?: string;
  target?: string; // Đối tượng/Phạm vi nghiên cứu
  region?: string; // Vùng miền
  year?: string;   // Năm học
  
  part1_introduction: string;
  part2_theory_status: string;
  part2_solutions: string;
  part2_results: string;
  part3_conclusion: string;
  part4_references: string;
}

export enum AppStep {
  INPUT = 'INPUT',
  
  // Part 1
  GENERATING_PART1 = 'GENERATING_PART1',
  EDITING_PART1 = 'EDITING_PART1',
  
  // Part 2A
  GENERATING_PART2A = 'GENERATING_PART2A',
  EDITING_PART2A = 'EDITING_PART2A',
  
  // Part 2B
  GENERATING_PART2B = 'GENERATING_PART2B',
  EDITING_PART2B = 'EDITING_PART2B',
  
  // Part 2C
  GENERATING_PART2C = 'GENERATING_PART2C',
  EDITING_PART2C = 'EDITING_PART2C',
  
  // Part 3 & 4
  GENERATING_PART34 = 'GENERATING_PART34',
  EDITING_PART34 = 'EDITING_PART34',
  
  // Final
  FINISHED = 'FINISHED'
}