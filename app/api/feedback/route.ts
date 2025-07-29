import { NextRequest, NextResponse } from "next/server";

interface FeedbackData {
  rating: number;
  category: string;
  message: string;
  email?: string;
  timestamp?: string;
  userAgent?: string;
  page?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: FeedbackData = await request.json();
    const { rating, category, message, email } = body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 10) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 10" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Add metadata
    const feedbackData: FeedbackData = {
      ...body,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || "",
      page: request.headers.get("referer") || "",
    };

    // In a real implementation, you would:
    // 1. Store in database
    // 2. Send to analytics service
    // 3. Trigger notifications for critical feedback
    // 4. Send email confirmation if email provided

    console.log("Feedback received:", feedbackData);

    // Mock storage - replace with actual database call
    const mockStorage = {
      id: `feedback_${Date.now()}`,
      ...feedbackData,
    };

    // Send email notification for low ratings or bugs
    if (rating <= 3 || category === "bug") {
      console.log("⚠️ Critical feedback received - should trigger notification");
    }

    // Send confirmation email if provided
    if (email) {
      console.log("📧 Should send confirmation email to:", email);
    }

    return NextResponse.json({
      success: true,
      feedbackId: mockStorage.id,
      message: "Thank you for your feedback!",
    });

  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would fetch feedback from database
    // For now, return mock data
    const mockFeedback = [
      {
        id: "feedback_1",
        rating: 9,
        category: "general",
        message: "Great experience! Very intuitive.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "feedback_2",
        rating: 7,
        category: "feature",
        message: "Would love more color options",
        timestamp: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      success: true,
      feedback: mockFeedback,
      summary: {
        totalFeedback: mockFeedback.length,
        averageRating: 8,
        topCategories: ["general", "feature"],
      },
    });

  } catch (error) {
    console.error("Feedback retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 }
    );
  }
} 