import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  History,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileEdit,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface VersionHistoryEntry {
  version: number;
  status: 'pending' | 'approved' | 'rejected';
  changesSummary: string;
  changedFieldsCount: number;
  changedFields: Array<{
    field: string;
    type: string;
    oldValue: any;
    newValue: any;
  }>;
  requestedBy: {
    _id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  requestedAt: string;
  reviewedBy?: {
    _id: string;
    name: string;
    email?: string;
  };
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

interface VersionHistoryData {
  submissionId: string;
  title: string;
  currentVersion: number;
  totalVersions: number;
  history: VersionHistoryEntry[];
}

interface VersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string;
  submissionTitle: string;
}

export default function VersionHistoryModal({
  open,
  onOpenChange,
  submissionId,
  submissionTitle,
}: VersionHistoryModalProps) {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<VersionHistoryData | null>(null);
  const [expandedVersions, setExpandedVersions] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (open && submissionId) {
      fetchHistory();
    }
  }, [open, submissionId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/submissions/${submissionId}/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch version history');

      const data = await res.json();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching version history:', error);
      alert('Failed to load version history');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (version: number) => {
    const newExpanded = new Set(expandedVersions);
    if (newExpanded.has(version)) {
      newExpanded.delete(version);
    } else {
      newExpanded.add(version);
    }
    setExpandedVersions(newExpanded);
  };

  const getStatusBadge = (status: string, isCurrent: boolean) => {
    const config = {
      pending: { variant: 'secondary' as const, icon: Clock, label: 'Pending' },
      approved: { variant: 'default' as const, icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
    };

    const { variant, icon: Icon, label } = config[status as keyof typeof config] || config.pending;

    return (
      <div className="flex items-center gap-2">
        <Badge variant={variant} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {label}
        </Badge>
        {isCurrent && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            Current
          </Badge>
        )}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatFieldName = (field: string) => {
    return field.replace(/([A-Z])/g, ' $1').trim().replace(/^./, (str) => str.toUpperCase());
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading version history...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[98vh] ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <History className="h-6 w-6" />
            Version History
          </DialogTitle>
          <DialogDescription>
            Complete version history for "{submissionTitle}"
          </DialogDescription>
        </DialogHeader>

        {historyData && (
          <div className="space-y-4">
            {/* Summary Card */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Version</p>
                    <p className="text-2xl font-bold text-primary">v{historyData.currentVersion}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Versions</p>
                    <p className="text-2xl font-bold">{historyData.totalVersions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Changes</p>
                    <p className="text-2xl font-bold">
                      {historyData.history.filter((h) => h.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Version Timeline */}
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {historyData.history.map((entry, index) => {
                  const isExpanded = expandedVersions.has(entry.version);
                  const isCurrent = entry.version === historyData.currentVersion && entry.status === 'approved';
                  const isOriginal = entry.version === 1;

                  return (
                    <Card
                      key={entry.version}
                      className={`relative ${isCurrent ? 'border-2 border-primary shadow-md' : ''}`}
                    >
                      {/* Timeline Connector */}
                      {index < historyData.history.length - 1 && (
                        <div className="absolute left-6 top-full h-4 w-0.5 bg-border" />
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {/* Version Badge */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 font-mono text-lg font-bold text-primary">
                              v{entry.version}
                            </div>

                            <div>
                              <CardTitle className="text-lg">
                                {isOriginal ? 'Initial Submission' : entry.changesSummary}
                              </CardTitle>
                              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-3 w-3" />
                                <span>{entry.requestedBy.name}</span>
                                <span>•</span>
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(entry.requestedAt)}</span>
                              </div>
                            </div>
                          </div>

                          {getStatusBadge(entry.status, isCurrent)}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Fields Changed Summary */}
                        {!isOriginal && entry.changedFieldsCount > 0 && (
                          <div className="flex items-center gap-2 text-sm">
                            <FileEdit className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {entry.changedFieldsCount} field{entry.changedFieldsCount !== 1 ? 's' : ''} modified
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpanded(entry.version)}
                              className="ml-auto"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                  Show Details
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Expanded Details */}
                        {isExpanded && entry.changedFields.length > 0 && (
                          <div className="mt-3 space-y-2 rounded-lg bg-muted p-3">
                            <p className="text-sm font-semibold">Changed Fields:</p>
                            {entry.changedFields.map((field, idx) => (
                              <div key={idx} className="text-xs">
                                <span className="font-medium">{formatFieldName(field.field)}</span>
                                <span className="text-muted-foreground"> ({field.type})</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Review Information */}
                        {entry.reviewedBy && entry.reviewedAt && (
                          <>
                            <Separator />
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Reviewed by:</span>
                                <span className="font-medium">{entry.reviewedBy.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">Reviewed at:</span>
                                <span>{formatDate(entry.reviewedAt)}</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Review Notes */}
                        {entry.reviewNotes && (
                          <div className="rounded-lg bg-muted p-3 text-sm">
                            <p className="font-semibold text-muted-foreground">Admin Notes:</p>
                            <p className="mt-1">{entry.reviewNotes}</p>
                          </div>
                        )}

                        {/* Rejection Reason */}
                        {entry.rejectionReason && (
                          <div className="rounded-lg bg-red-50 p-3 text-sm">
                            <p className="font-semibold text-red-900">Rejection Reason:</p>
                            <p className="mt-1 text-red-800">{entry.rejectionReason}</p>
                          </div>
                        )}

                        {/* Action: View Full Version --- We can do it later if Client Want*/}
                        {/* {!isOriginal && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`/submissions/${submissionId}/version/${entry.version}`, '_blank')}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Version
                          </Button>
                        )} */}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}