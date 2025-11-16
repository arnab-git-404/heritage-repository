import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  History,
  User,
  AlertCircle,
  Eye,
  Clock, Pencil
} from 'lucide-react';

export default function AmendmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
//   const [amendment, setAmendment] = useState<any>(null);
//   const [comparison, setComparison] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

const [showViewModal, setShowViewModal] = useState(false);

const [viewingAmendment, setViewingAmendment] = useState<any | null>(null);
const [viewComparison, setViewComparison] = useState<any | null>(null);


  useEffect(() => {
    fetchAmendmentDetails();
  }, [id]);

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

  const fetchAmendmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken') ;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/amendments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch amendment details');

      const data = await res.json();
      setViewingAmendment(data.amendment);
      setViewComparison(data.comparison);
    } catch (error) {
      console.error('Error fetching amendment details:', error);
      alert('Failed to fetch amendment details');
      navigate('/amendments');
    } finally {
      setLoading(false);
    }
  };

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

  const handleReview = async (approved: boolean) => {
    if (!approved && !reviewNotes.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token') || localStorage.getItem('adminToken') ;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/amendments/${id}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            approved,
            reviewNotes: reviewNotes || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors?.[0]?.msg || 'Failed to review amendment');
      }

      alert(
        approved
          ? `Amendment approved! Now ${data.newVersion ? `v${data.newVersion}` : 'live'}`
          : 'Amendment rejected - Original version preserved'
      );

      navigate('/amendments');
    } catch (error) {
      console.error('Error reviewing amendment:', error);
      alert(error instanceof Error ? error.message : 'Failed to review amendment');
    } finally {
      setSubmitting(false);
    }
  };




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading amendment details...</p>
        </div>
      </div>
    );
  }

  if (!viewingAmendment || !viewComparison) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Amendment not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/amendments')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Amendments
        </Button>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Amendment Request Details</h1>
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
                    // setSelectedAmendment(viewingAmendment);
                    // setComparison(viewComparison);
                    // setReviewAction('reject');
                    setShowViewModal(false);
                    // handleReview();
                    handleReview(false);
                  }}
                  disabled={submitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Amendment
                </Button>
                <Button
                  onClick={() => {
                    // setSelectedAmendment(viewingAmendment);
                    // setComparison(viewComparison);
                    // setReviewAction('approve');
                    // setShowViewModal(false);
                    // handleReview();
                    handleReview(true);
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
  );
}
