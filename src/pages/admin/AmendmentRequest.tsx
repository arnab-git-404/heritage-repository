import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileEdit,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  History,
  User,
  Calendar,
} from 'lucide-react';
import type { AmendmentRequest} from '@/types/AmendmentRequest';
import type { Comparison } from '@/types/Comparison';




export default function AmendmentRequests() {
  const navigate = useNavigate();
  const [amendments, setAmendments] = useState<AmendmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAmendment, setSelectedAmendment] = useState<AmendmentRequest | null>(null);
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

// Add new state for view modal
const [showViewModal, setShowViewModal] = useState(false);
const [viewingAmendment, setViewingAmendment] = useState<AmendmentRequest | null>(null);
const [viewComparison, setViewComparison] = useState<Comparison | null>(null);



  useEffect(() => {
    fetchAmendments();
  }, [statusFilter, currentPage]);

  const fetchAmendments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken') ;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/amendments?status=${statusFilter}&page=${currentPage}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch amendments');

      const data = await res.json();
      setAmendments(data.amendments);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching amendments:', error);
      alert('Failed to fetch amendment requests');
    } finally {
      setLoading(false);
    }
  };

  const viewAmendmentDetails = async (amendmentId: string) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken');
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/amendments/${amendmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch amendment details');

      const data = await res.json();
    //   setSelectedAmendment(data.amendment);
    //   setComparison(data.comparison);

    setViewingAmendment(data.amendment);
    setViewComparison(data.comparison);
    setShowViewModal(true); // ⬅️ Open view modal

    } catch (error) {
      console.error('Error fetching amendment details:', error);
      alert('Failed to fetch amendment details');
    }
  };

  const handleReview = async () => {
    if (!selectedAmendment) return;

    if (reviewAction === 'reject' && !reviewNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken') ;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/amendments/${selectedAmendment._id}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            approved: reviewAction === 'approve',
            reviewNotes: reviewNotes || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Failed to review amendment');
      }

      alert(
        reviewAction === 'approve'
          ? `Amendment approved! Now ${data.newVersion ? `v${data.newVersion}` : 'live'}`
          : 'Amendment rejected - Original version preserved'
      );

      setShowReviewDialog(false);
      setSelectedAmendment(null);
      setComparison(null);
      setReviewNotes('');
      fetchAmendments();
    } catch (error) {
      console.error('Error reviewing amendment:', error);
      alert(error instanceof Error ? error.message : 'Failed to review amendment');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending: { variant: 'default', icon: Clock, label: 'Pending' },
      approved: { variant: 'default', icon: CheckCircle, label: 'Approved' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejected' },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
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

  const renderFieldComparison = (field: string, before: any, after: any, type: string) => {
    // Handle file URLs
    if (type === 'file') {
      return (
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Before:</strong>
            <a
              href={before}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2"
            >
              View old file
            </a>
          </div>
          <div className="text-sm">
            <strong>After:</strong>
            <a
              href={after}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline ml-2"
            >
              View new file
            </a>
          </div>
        </div>
      );
    }

    // Handle arrays
    if (type === 'array') {
      return (
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Before:</strong> {JSON.stringify(before)}
          </div>
          <div className="text-sm">
            <strong>After:</strong> {JSON.stringify(after)}
          </div>
        </div>
      );
    }

    // Handle objects
    if (type === 'object') {
      return (
        <div className="space-y-2">
          <div className="text-sm">
            <strong>Before:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
              {JSON.stringify(before, null, 2)}
            </pre>
          </div>
          <div className="text-sm">
            <strong>After:</strong>
            <pre className="bg-gray-100 p-2 rounded mt-1 text-xs overflow-auto">
              {JSON.stringify(after, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    // Handle text
    return (
      <div className="space-y-2">
        <div className="text-sm">
          <strong>Before:</strong> <span className="text-red-600 line-through">{before}</span>
        </div>
        <div className="text-sm">
          <strong>After:</strong> <span className="text-green-600 font-semibold">{after}</span>
        </div>
      </div>
    );
  };


// Add helper function for rendering field values
const renderFieldValue = (value: any, type: string) => {
  if (!value && value !== 0 && value !== false) {
    return <span className="text-muted-foreground italic">No value</span>;
  }

  // File URLs
  if (type === 'file') {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <Eye className="h-3 w-3" />
        View File
      </a>
    );
  }

  // Arrays
  if (type === 'array') {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-1">
        {arr.map((item, i) => (
          <div key={i} className="text-sm">
            • {String(item)}
          </div>
        ))}
      </div>
    );
  }

  // Objects
  if (type === 'object') {
    return (
      <pre className="text-xs overflow-auto max-h-40 p-2 bg-white rounded">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // Text
  return <div className="text-sm whitespace-pre-wrap break-words">{String(value)}</div>;
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading amendment requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/admin')} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileEdit className="h-8 w-8 text-primary" />
              Amendment Requests
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage content update requests from users
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {amendments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">
              No {statusFilter} amendment requests found
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>
                {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Amendments
              </CardTitle>
              <CardDescription>
                Total: {amendments.length} amendment request(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Changes Summary</TableHead>
                    <TableHead>Fields Changed</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {amendments.map((amendment) => (
                    <TableRow key={amendment._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            v{amendment.previousVersionNumber} → v{amendment.versionNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{amendment.submissionId.title}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {amendment.submissionId._id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {amendment.userId.avatar ? (
                            <img
                              src={amendment.userId.avatar}
                              alt={amendment.userId.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-sm">{amendment.userId.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {amendment.userId.tribe || amendment.userId.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate" title={amendment.changesSummary}>
                          {amendment.changesSummary}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{amendment.changedFields.length} fields</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(amendment.requestedAt)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(amendment.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => 
                                
                                // viewAmendmentDetails(amendment._id) 

                                navigate(`/admin/amendments/${amendment._id}`)

                            }
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>

                          {amendment.status === 'pending' && (
                            <>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  setSelectedAmendment(amendment);
                                  viewAmendmentDetails(amendment._id);
                                  setReviewAction('approve');
                                  setShowReviewDialog(true);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedAmendment(amendment);
                                  viewAmendmentDetails(amendment._id);
                                  setReviewAction('reject');
                                  setShowReviewDialog(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}


{/* ===== VIEW MODAL - Detailed Comparison ===== */}
<Dialog open={showViewModal} onOpenChange={setShowViewModal}>
  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-2xl">
        <FileEdit className="h-6 w-6" />
        Amendment Request Details
      </DialogTitle>
      <DialogDescription>
        Review the proposed changes side-by-side with current content
      </DialogDescription>
    </DialogHeader>

    {viewingAmendment && viewComparison && (
      <div className="space-y-6">
        {/* Version Badge */}
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              <History className="h-4 w-4 mr-2" />
              {viewComparison.current.version} → {viewComparison.proposed.version}
            </Badge>
            {getStatusBadge(viewingAmendment.status)}
          </div>
          <div className="text-sm text-muted-foreground">
            Requested: {formatDate(viewingAmendment.requestedAt)}
          </div>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Submitted By</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {viewingAmendment.userId.avatar ? (
                <img
                  src={viewingAmendment.userId.avatar}
                  alt={viewingAmendment.userId.name}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <p className="font-semibold">{viewingAmendment.userId.name}</p>
                <p className="text-sm text-muted-foreground">{viewingAmendment.userId.email}</p>
                <p className="text-xs text-muted-foreground">
                  {viewingAmendment.userId.tribe} • {viewingAmendment.userId.country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes Summary */}
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription>
            <strong className="text-blue-900">User's Summary:</strong>
            <p className="mt-1 text-blue-800">{viewComparison.summary}</p>
          </AlertDescription>
        </Alert>

        {/* Side-by-Side Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Side-by-Side Comparison ({viewComparison.changes.length} changes)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {viewComparison.changes.map((change, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  {/* Field Name */}
                  <div className="mb-4 pb-2 border-b">
                    <h4 className="font-semibold text-base capitalize flex items-center gap-2">
                      {change.field.replace(/([A-Z])/g, ' $1').trim()}
                      <Badge variant="secondary" className="text-xs">
                        {change.type}
                      </Badge>
                    </h4>
                  </div>

                  {/* Side-by-Side Content */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* BEFORE */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                        <strong className="text-sm text-red-700">
                          Current ({viewComparison.current.version})
                        </strong>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded p-3">
                        {renderFieldValue(change.before, change.type)}
                      </div>
                    </div>

                    {/* AFTER */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <strong className="text-sm text-green-700">
                          Proposed ({viewComparison.proposed.version})
                        </strong>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        {renderFieldValue(change.after, change.type)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Section (if pending) */}
        {viewingAmendment.status === 'pending' && (
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-lg">Review Actions</CardTitle>
              <CardDescription>Approve or reject this amendment request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="view-review-notes">Admin Notes (Optional for approve, Required for reject)</Label>
                <Textarea
                  id="view-review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add notes about this review..."
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (!reviewNotes.trim()) {
                      alert('Please provide a rejection reason');
                      return;
                    }
                    setSelectedAmendment(viewingAmendment);
                    setComparison(viewComparison);
                    setReviewAction('reject');
                    setShowViewModal(false);
                    handleReview();
                  }}
                  disabled={submitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Amendment
                </Button>
                <Button
                  onClick={() => {
                    setSelectedAmendment(viewingAmendment);
                    setComparison(viewComparison);
                    setReviewAction('approve');
                    setShowViewModal(false);
                    handleReview();
                  }}
                  disabled={submitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Amendment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Review History (if reviewed) */}
        {viewingAmendment.status !== 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Reviewed By:</strong> {viewingAmendment.reviewedBy?.name || 'N/A'}
                </div>
                <div>
                  <strong>Reviewed At:</strong>{' '}
                  {viewingAmendment.reviewedAt ? formatDate(viewingAmendment.reviewedAt) : 'N/A'}
                </div>
              </div>
              {viewingAmendment.reviewNotes && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <strong className="text-sm">Admin Notes:</strong>
                  <p className="text-sm mt-1">{viewingAmendment.reviewNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    )}

    <DialogFooter>
      <Button variant="outline" onClick={() => setShowViewModal(false)}>
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>


      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Amendment' : 'Reject Amendment'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve'
                ? 'Review the changes and approve this amendment request'
                : 'Provide a reason for rejecting this amendment request'}
            </DialogDescription>
          </DialogHeader>

          {selectedAmendment && comparison && (
            <div className="space-y-6">
              {/* Version Info */}
              <Alert>
                <History className="h-4 w-4" />
                <AlertDescription>
                  <strong>Version Change:</strong> {comparison.current.version} →{' '}
                  {comparison.proposed.version}
                </AlertDescription>
              </Alert>

              {/* User Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User's Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{comparison.summary}</p>
                </CardContent>
              </Card>

              {/* Changes Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Detailed Changes ({comparison.changes.length} fields)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {comparison.changes.map((change, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h4 className="font-semibold text-sm mb-2 capitalize">
                        {change.field.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      {renderFieldComparison(
                        change.field,
                        change.before,
                        change.after,
                        change.type
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Review Notes */}
              <div className="space-y-2">
                <Label htmlFor="review-notes">
                  {reviewAction === 'approve' ? 'Admin Notes (Optional)' : 'Rejection Reason *'}
                </Label>
                <Textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'approve'
                      ? 'Add any notes for the user (optional)'
                      : 'Explain why this amendment is being rejected (required)'
                  }
                  rows={4}
                  required={reviewAction === 'reject'}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={submitting || (reviewAction === 'reject' && !reviewNotes.trim())}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : reviewAction === 'approve' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve Amendment
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Amendment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}